import os
import logging
import discord
from discord.ext import commands
from discord import app_commands

log = logging.getLogger(__name__)


class RSSHelper(commands.Cog):
    """Contains set of commands to manage per-guild RSS feeds"""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    # TODO /rss create

    # TODO /rss delete

    # TODO /rss list


async def setup(bot: commands.Bot):
    await bot.add_cog(RSSHelper(bot))
