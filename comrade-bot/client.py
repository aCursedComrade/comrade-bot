import os
import logging
import traceback
import datetime
import typing
import discord
import aiohttp
import feedparser
from discord.ext import commands
from pymongo import MongoClient

log = logging.getLogger(__name__)


class ComradeBot(commands.Bot):
    """The class representing the client/bot. Comrade bot :)"""

    client: aiohttp.ClientSession
    init_time: datetime.datetime = datetime.datetime.now()
    cmd_dir: str = "/".join([os.getcwd(), "comrade-bot", "commands"])

    def __init__(self, *args: typing.Any, **kwargs: typing.Any):
        self.mongo = MongoClient(os.environ["DB_URI"])
        self.db = self.mongo[os.environ["DB_NAME"]]

        intents = discord.Intents.none()
        intents.guilds = True
        intents.guild_messages = True
        intents.dm_messages = True
        intents.webhooks = True

        super().__init__(
            command_prefix=commands.when_mentioned, intents=intents, *args, **kwargs
        )
        self.synced = False

    def begin(self, *args: typing.Any, **kwargs: typing.Any):
        """Starts the bot"""
        try:
            super().run(
                token=str(os.getenv("TOKEN")),
                reconnect=True,
                log_handler=None,
                *args,
                **kwargs,
            )
        except discord.ConnectionClosed:
            log.error("Connection with the gateway was closed unexpectedly")
            exit(1)
        except discord.GatewayNotFound:
            log.error("Discord API gateway is unreachable")
            exit(1)
        except discord.LoginFailure:
            log.error("Failed to login as client")
            exit(1)
        except KeyboardInterrupt:
            log.warning("Exiting...")
            exit()

    async def load_cogs(self):
        """Loads all cogs/commands in the `commands` directory"""
        for file in os.listdir(self.cmd_dir):
            if file.endswith(".py") and not file.startswith("_"):
                try:
                    await self.load_extension(f"comrade-bot.commands.{file[:-3]}")
                    log.info(f"Loaded {file[:-3]}")
                except commands.ExtensionError:
                    log.error(f"Failed to load {file[:-3]}\n{traceback.format_exc()}")

        log.warning("All cogs loaded")

    async def setup_hook(self):
        feedparser.USER_AGENT = os.getenv("USER_AGENT", "Comrade Bot")

        self.client = aiohttp.ClientSession()
        await self.load_cogs()
        # if not self.synced:
        #     await self.tree.sync()
        #     self.synced = not self.synced
        #     log.info("Synced global commands")

    async def on_ready(self):
        log.warning(f"Logged in as {self.user} ({self.user.id})")

    async def on_error(
        self, event_method: str, *args: typing.Any, **kwargs: typing.Any
    ):
        log.error(
            f"Client met with an exception handling {event_method}:\n{traceback.format_exc()}"
        )

    async def close(self):
        await super().close()
        await self.client.close()

    @property
    def user(self) -> discord.ClientUser:
        assert super().user, "Bot is not ready yet"
        return typing.cast(discord.ClientUser, super().user)

    @property
    def uptime(self) -> datetime.timedelta:
        return datetime.datetime.now() - self.init_time
