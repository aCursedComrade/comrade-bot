import os
import logging
import requests
import discord
from client import ComradeBot
from discord.ext import commands
from discord import app_commands

log = logging.getLogger(__name__)


class General(commands.Cog):
    """Contains a set of generic commands"""

    def __init__(self, bot: ComradeBot):
        self.bot = bot

        # add the UwUify message context menu command
        self.message_uwuify = app_commands.ContextMenu(
            name="UwUify", callback=self.uwuify
        )
        self.bot.tree.add_command(self.message_uwuify)

    @app_commands.command()
    async def ping(self, itr: discord.Interaction):
        """Pong!"""
        await itr.response.send_message(f"Pong! (Latency: {self.bot.latency * 1000}ms)")

    @app_commands.command()
    @app_commands.describe(url="The link/URL you want to lenghten")
    async def lengthen(self, itr: discord.Interaction, url: str):
        """Find the original link from a shortened link"""
        await itr.response.defer()

        head = requests.head(
            url, headers={"User-Agent": os.environ["USER_AGENT"]}, allow_redirects=True
        )
        if head.ok:
            await itr.followup.send(head.url)
        else:
            log.error(f"HEAD failed {head.status_code}: {head.reason}")
            await itr.followup.send("Could not determine the original URL")

    @app_commands.command()
    async def dadjoke(self, itr: discord.Interaction):
        """Want to see a dadjoke?"""
        await itr.response.defer()

        # https://icanhazdadjoke.com/
        response = requests.get(
            "https://icanhazdadjoke.com/",
            headers={
                "User-Agent": os.environ["USER_AGENT"],
                "Accept": "application/json",
            },
        )
        if response.ok:
            await itr.followup.send(response.json()["joke"])
        else:
            log.error(
                f"Failed to fetch dadjoke ({response.status_code}): {response.reason}"
            )
            await itr.followup.send(
                "Failed to find a dadjoke, try again later :pensive:"
            )

    @app_commands.command()
    async def meme(self, itr: discord.Interaction):
        """Returns a random meme"""
        await itr.response.defer()

        # https://meme-api.com/
        response = requests.get(
            "https://meme-api.com/gimme",
            headers={
                "User-Agent": os.environ["USER_AGENT"],
                "Accept": "application/json",
            },
        )
        if response.ok:
            meme = response.json()
            embed = discord.Embed(title=meme["title"], url=meme["postLink"])
            embed.set_author(name=f"u/{meme['author']}")
            embed.set_footer(text=f"r/{meme['subreddit']}")
            embed.set_image(url=meme["url"])
            await itr.followup.send(embed=embed)
        else:
            log.error(
                f"Failed to fetch meme ({response.status_code}): {response.reason}"
            )
            await itr.followup.send("Failed to fetch a meme, try again later :pensive:")

    async def uwuify(self, itr: discord.Interaction, msg: discord.Message):
        """Why did I make this"""
        await itr.response.defer()

        # https://uwu.pm
        cursed_data = requests.post(
            "https://uwu.pm/api/v1/uwu",
            headers={
                "User-Agent": os.environ["USER_AGENT"],
                "Accept": "application/json",
            },
            json={"provider": "uwwwupp", "text": msg.content},
        )
        if cursed_data.ok:
            curse = cursed_data.json()
            await itr.followup.send(content=curse["uwu"])
        else:
            log.error(
                f"Failed to fetch the UwU ({cursed_data.status_code}): {cursed_data.reason}"
            )
            await itr.followup.send(content="Faiwled to uwuify twe twext :(")


async def setup(bot: ComradeBot):
    await bot.add_cog(General(bot))
