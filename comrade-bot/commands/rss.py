import time
import typing
import logging
import discord
import datetime
from feedparser import parse
from ..client import ComradeBot
from discord import Forbidden, app_commands
from discord.ext import commands, tasks
from pymongo.collection import Collection
from ..rss.schema import RSSEntry
from ..rss.core import fetcher
from bson import ObjectId

log = logging.getLogger(__name__)


@app_commands.guild_only()
class RSSHelper(commands.GroupCog, group_name="rss"):
    """Contains set of commands to manage per-guild RSS feeds"""

    def __init__(self, bot: ComradeBot):
        self.bot = bot
        self.runner.start()
        self.collection: Collection[RSSEntry] = self.bot.db.rssentries

    async def cog_app_command_error(
        self,
        interaction: discord.Interaction,
        error: app_commands.AppCommandError | Exception,
    ):
        if isinstance(error, app_commands.MissingPermissions):
            message = "You lack permissions to use this command."
        else:
            log.error("Error handling rss command: %s", error)
            message = "Ran into an error while processing, try again later."

        try:
            await interaction.response.send_message(message, ephemeral=True)
        except discord.InteractionResponded:
            await interaction.followup.send(message, ephemeral=True)

    @app_commands.command()
    @app_commands.describe(
        url="URL of the feed", channel="Text channel to post feed records"
    )
    @app_commands.checks.has_permissions(manage_webhooks=True)
    async def add(
        self, itr: discord.Interaction, url: str, channel: discord.TextChannel
    ):
        """Adds a feed to the followed list of feeds"""
        if itr.guild is None:
            return

        await itr.response.defer()
        # grab the published time of third from the last entry
        try:
            feed = parse(url)
            last_update = datetime.datetime.fromisoformat(
                time.strftime("%Y-%m-%dT%H:%M:%SZ", feed.entries[2].published_parsed)
            )
        except Exception as error:
            log.error("Failed to parse feed: %s", error)
            return await itr.followup.send(
                "Failed to parse feed. Make sure it is a valid RSS/Atom feed."
            )

        # see if a webhook exists for the channel, otherwise create a new one
        try:
            existing = self.collection.find_one({"channel_id": str(channel.id)})
            if existing:
                wh_id = existing["webhookId"]
                wh_token = existing["webhookToken"]
            else:
                webhook = await channel.create_webhook(
                    name=self.bot.user.name,
                    reason="Created for posting RSS events.",
                )
                wh_id = webhook.id
                wh_token = str(webhook.token)
        except Forbidden as error:
            log.error("Webhook creation forbidden: %s", error)
            return await itr.followup.send(
                "Failed to create a webhook. Make sure I have the correct permission to create webhooks."
            )
        except Exception as error:
            log.error("Failed at webhook creation: %s", error)
            return await itr.followup.send(
                "Sorry, there was an error creating a new subscription, try again later."
            )

        self.collection.insert_one(
            RSSEntry(
                rss_source=url,
                last_update=last_update,
                guild_id=str(itr.guild.id),
                channel_id=str(channel.id),
                webhookId=str(wh_id),
                webhookToken=wh_token,
            )
        )

        await itr.followup.send(
            f"Feed events from `{url}` will be posted in <#{channel.id}>"
        )

    @app_commands.command()
    @app_commands.describe(feed="Feed you want to remove")
    @app_commands.checks.has_permissions(manage_webhooks=True)
    async def delete(self, itr: discord.Interaction, feed: str):
        """Deletes a feed from the followed list of feeds"""
        await itr.response.defer()

        deleted = self.collection.find_one_and_delete({"_id": ObjectId(feed)})
        await itr.followup.send(
            f"Removed `{deleted['rss_source']}` from <#{deleted['channel_id']}>"
        )

        if self.collection.count_documents({"channel_id": deleted["channel_id"]}) < 1:
            try:
                webhook = await self.bot.fetch_webhook(int(deleted["webhookId"]))
                await webhook.delete(
                    reason="Webhook is no longer used for posting RSS events."
                )
            except Forbidden as error:
                log.error("Webhook deletion forbidden: %s", error)

                await itr.followup.send(
                    f"Unable to cleanup the webhook from <#{deleted['channel_id']}> channel. You may delete it manually."
                )
            except Exception as error:
                log.error("Error deleting the webhook: %s", error)

    @app_commands.command()
    async def list(self, itr: discord.Interaction):
        """List down the feeds followed by the guild"""
        if itr.guild is None:
            return

        await itr.response.defer()
        embed = discord.Embed(
            title="RSS Feeds",
            description="List of RSS feeds configured for this guild. Events are posted via webhooks managed by the bot. Runs every 30 minutes.",
            timestamp=datetime.datetime.now(tz=datetime.timezone.utc),
        )
        embed.set_footer(text=itr.guild.name, icon_url=itr.guild.icon)

        if self.collection.count_documents({"guild_id": str(itr.guild.id)}) < 1:
            embed.add_field(
                name="No feeds found",
                value="Use the `/rss add` command to add feeds for this guild.",
            )
        else:
            for record in self.collection.find({"guild_id": str(itr.guild.id)}):
                embed.add_field(
                    name=record["rss_source"],
                    value=f"Posted in <#{record['channel_id']}>",
                    inline=False,
                )

        await itr.followup.send(embed=embed)

    @delete.autocomplete("feed")
    async def map_rss(
        self, itr: discord.Interaction, search: str
    ) -> typing.List[app_commands.Choice[str]]:
        regex = "{}".format(search)
        records = self.collection.find(
            {"rss_source": {"$regex": regex}, "guild_id": itr.guild_id}
        )

        return [
            app_commands.Choice(name=r["rss_source"], value=str(r["_id"]))  # type: ignore
            for r in records
        ][:25]

    @tasks.loop(minutes=15)
    async def runner(self):
        await fetcher(self.bot)


async def setup(bot: ComradeBot):
    await bot.add_cog(RSSHelper(bot))
