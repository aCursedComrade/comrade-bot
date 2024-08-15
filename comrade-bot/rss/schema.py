from typing import TypedDict, NotRequired
from datetime import datetime
from bson import ObjectId


class RSSEntry(TypedDict):
    _id: NotRequired[ObjectId]
    rss_source: str
    last_update: datetime
    guild_id: str
    channel_id: str
    webhookId: str
    webhookToken: str
