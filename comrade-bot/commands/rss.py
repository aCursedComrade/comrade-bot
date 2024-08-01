import os
import logging
import discord
from client import ComradeBot
from discord.ext import commands
from discord import app_commands

log = logging.getLogger(__name__)


@app_commands.guild_only()
class RSSHelper(commands.GroupCog, group_name="rss"):
    """Contains set of commands to manage per-guild RSS feeds"""

    def __init__(self, bot: ComradeBot):
        self.bot = bot

    def interaction_check(self, itr: discord.Interaction):
        return True

    @app_commands.command()
    @app_commands.describe(
        link="URL of the feed", channel="Text channel to post feed records"
    )
    async def add(
        self, itr: discord.Interaction, link: str, channel: discord.TextChannel
    ):
        """Adds a feed to the followed list of feeds"""
        await itr.response.send_message("TODO")

    @app_commands.command()
    @app_commands.describe(id="ID of the feed you want to delete")
    async def delete(self, itr: discord.Interaction, id: str):
        """Deletes a feed from the followed list of feeds"""
        await itr.response.send_message("TODO")

    @app_commands.command()
    async def list(self, itr: discord.Interaction):
        """List down the feeds followed by the guild"""
        await itr.response.send_message("TODO")


async def setup(bot: ComradeBot):
    await bot.add_cog(RSSHelper(bot))
