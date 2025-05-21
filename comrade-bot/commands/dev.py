import logging
import discord
from ..client import ComradeBot
from discord.ext import commands
from ..rss.core import fetcher

log = logging.getLogger(__name__)


class Dev(commands.Cog):
    """Development or administrative commands related to the bot"""

    def __init__(self, bot: ComradeBot):
        self.bot = bot

    async def cog_command_error(self, ctx: commands.Context, error: Exception):
        if isinstance(error, commands.NotOwner):
            await ctx.reply("Nuh uh")
        else:
            log.error(f"Error in cog: %s", error)
            embed = discord.Embed()
            embed.__setattr__("title", "Error (Dev module)")
            embed.__setattr__(
                "description", "An error was raised during execution. Check the logs."
            )
            await ctx.reply(embed=embed)

    @commands.command()
    @commands.is_owner()
    async def fetch_rss(self, ctx: commands.Context):
        """Manually invoke the fetcher"""
        followup = await ctx.reply("Invoking fetcher...")
        log.warning("Manually invoking RSS fetcher")
        await fetcher(self.bot)
        await followup.reply("Fetcher completed successfully")

    @commands.command()
    @commands.is_owner()
    async def sync(self, ctx: commands.Context):
        """Syncs all commands to the global space"""
        await self.bot.tree.sync()
        log.warning("Commands resynced")
        await ctx.reply("Commands resynced")


async def setup(bot: ComradeBot):
    await bot.add_cog(Dev(bot))
