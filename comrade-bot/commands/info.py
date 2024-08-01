import logging
import typing
import discord
import datetime
from client import ComradeBot
from discord.ext import commands
from discord import app_commands

log = logging.getLogger(__name__)


class InfoHelper(commands.Cog):
    """Contains a set of informational commands"""

    def __init__(self, bot: ComradeBot):
        self.bot = bot

    @app_commands.command()
    async def about(self, itr: discord.Interaction):
        """About the bot"""
        if self.bot.user:
            embed = discord.Embed(
                title=self.bot.user.name,
                description="Made by [aCursedComrade](https://comradelab.win/about) because he was bored.",
                timestamp=datetime.datetime.now(datetime.UTC),
            )
            embed.set_thumbnail(
                url=self.bot.user.avatar.url if self.bot.user.avatar else None
            )
            embed.set_footer(text=f"Client ID: {self.bot.user.id}")
            embed.add_field(
                name="Source",
                value="[GitHub](https://github.com/aCursedComrade/comrade-bot)",
            )
            embed.add_field(name="Total guilds", value=self.bot.guilds.__len__())
            embed.add_field(name="Latency", value=f"{self.bot.latency * 1000} ms")
            embed.add_field(name="Uptime (H:M:S)", value=self.bot.uptime, inline=False)

            await itr.response.send_message(embed=embed)
        else:
            log.error("Bot user is not initialized")
            await itr.response.send_message("Something went wrong, try again later")

    @app_commands.command()
    @app_commands.guild_only()
    @app_commands.describe(user="User to look up information on")
    async def user(self, itr: discord.Interaction, user: discord.Member | None):
        """Looks up information about the current or another user"""
        user = user or typing.cast(discord.Member, itr.user)
        embed = discord.Embed(
            title=user.name,
            description=f"<@{user.id}>",
            timestamp=datetime.datetime.now(datetime.UTC),
            color=user.color,
        )
        embed.set_thumbnail(url=user.display_avatar.url)
        embed.set_footer(text=f"User ID: {user.id}")
        embed.add_field(
            name="Registered at", value=f"<t:{int(user.created_at.timestamp())}:D>"
        )
        if itr.guild and user.joined_at:
            embed.add_field(
                name="Joined at", value=f"<t:{int(user.joined_at.timestamp())}:D>"
            )
            embed.add_field(name="Top role", value=f"<@&{user.top_role.id}>")
            embed.add_field(
                name="Can moderate guild members?",
                value=f"{'Yes' if user.guild_permissions.moderate_members else 'No'}",
                inline=False,
            )
            embed.add_field(
                name="Is guild administrator?",
                value=f"{'Yes' if user.guild_permissions.administrator else 'No'}",
                inline=False,
            )
            embed.add_field(
                name="Is guild owner?",
                value=f"{'Yes' if itr.guild.owner_id == user.id else 'No'}",
                inline=False,
            )

        await itr.response.send_message(embed=embed, ephemeral=True)

    @app_commands.command()
    @app_commands.guild_only()
    async def guild(self, itr: discord.Interaction):
        """Looks up information about the current guild"""
        if itr.guild:
            guild = itr.guild
            embed = discord.Embed(
                title=guild.name,
                description=guild.description,
                timestamp=datetime.datetime.now(datetime.UTC),
                color=guild.owner.color if guild.owner else None,
            )
            embed.set_thumbnail(url=guild.icon)
            embed.set_image(url=guild.banner)
            embed.set_footer(text=f"Guild ID: {guild.id}")
            embed.add_field(name="Guild owner", value=f"<@{guild.owner_id}>")
            embed.add_field(
                name="Created at", value=f"<t:{int(guild.created_at.timestamp())}:D>"
            )
            embed.add_field(name="Member count", value=guild.member_count)
            embed.add_field(name="Text channels", value=guild.text_channels.__len__())
            embed.add_field(name="Voice channels", value=guild.voice_channels.__len__())
            embed.add_field(name="Role count", value=guild.roles.__len__())
            embed.add_field(name="Emoji count", value=guild.emojis.__len__())

            await itr.response.send_message(embed=embed, ephemeral=True)
        else:
            log.error("Failed to resolve guild information")
            await itr.response.send_message(
                content="Failed to resolve guild information, try again later.",
                ephemeral=True,
            )


async def setup(bot: ComradeBot):
    await bot.add_cog(InfoHelper(bot))
