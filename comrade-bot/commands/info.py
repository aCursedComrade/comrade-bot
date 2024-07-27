import os
import logging
import discord
from discord.ext import commands
from discord import app_commands

log = logging.getLogger(__name__)


class InfoHelper(commands.Cog):
    """Contains a set of informational commands"""

    def __init__(self, bot: commands.Bot):
        self.bot = bot

    # TODO /about

    # TODO /info user

    # TODO /info guild


async def setup(bot: commands.Bot):
    await bot.add_cog(InfoHelper(bot))
