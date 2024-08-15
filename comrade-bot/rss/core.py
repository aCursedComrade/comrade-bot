import logging
import datetime
import time
from typing import Any
from discord import Embed
from feedparser import parse
from pymongo.collection import Collection
from .schema import RSSEntry
from ..client import ComradeBot
from ..util import remove_html

log = logging.getLogger(__name__)


async def fetcher(bot: ComradeBot):
    """Background runner for RSS events"""

    # FIXME need to update the schema by splitting sources from guild subscriptions
    # so we can have multiple guilds subscribe to same source, making it easier to fetch/update

    collection: Collection[RSSEntry] = bot.db.rssentries
    records = collection.find({})

    # get all the unique sources
    sources: set[str] = set()
    for record in records:
        sources.add(record["rss_source"])

    log.info(sources)

    # fetch the sources
    posts: dict[str, Any] = {}
    for source in sources:
        try:
            parsed = parse(source)
            posts[source] = parsed

            log.info("Fetched %i posts from %s", len(parsed.entries), source)
        except Exception as error:
            log.error("Failed to fetch source (%s): %s", source, error)

    records = collection.find({})

    # post the new items and uptate the last update time
    for record in records:
        last_update = datetime.datetime.fromisoformat(
            record["last_update"].strftime("%Y-%m-%dT%H:%M:%SZ")
        )
        source = posts[record["rss_source"]]

        embeds: list[Embed] = []

        # filter out the new ones and create embeds
        for item in source.entries:
            post_date = datetime.datetime.fromisoformat(
                time.strftime("%Y-%m-%dT%H:%M:%SZ", item.published_parsed)
            )

            if post_date.timestamp() > last_update.timestamp():
                embed = Embed(
                    title=item.get("title", "(No title)"),
                    url=item.get("link", None),
                    description=(
                        remove_html(item.get("description", "(No description)"))
                        if "description" in item
                        else remove_html(item.get("summary", "(No description)"))
                    ),
                    timestamp=post_date,
                )
                embed.set_thumbnail(url=item.image.href if "image" in item else None)
                embed.set_author(
                    name=source.feed.title,
                    url=source.feed.link,
                    icon_url=source.feed.image.href if "image" in source.feed else None,
                )

                embeds.append(embed)
            else:
                continue

        # only post and update the record if we have new RSS items
        if len(embeds):
            embeds.reverse()
            web_hook = await bot.fetch_webhook(int(record["webhookId"]))
            # send the last 10 in case there are more than 10 embeds
            await web_hook.send(
                username=bot.user.name,
                avatar_url=bot.user.display_avatar.url,
                embeds=embeds[-10:],
            )

            latest_update = datetime.datetime.fromisoformat(
                time.strftime("%Y-%m-%dT%H:%M:%SZ", source.entries[0].published_parsed)
            )
            collection.update_one({"_id": record["_id"]}, {"$set": {"last_update": latest_update}})  # type: ignore

        time.sleep(1.0)
