import os
import logging
from .client import ComradeBot
from dotenv import load_dotenv

load_dotenv()

# setup the log level
log_level = os.getenv("LOG_LEVEL")
if log_level:
    log_val = getattr(logging, log_level.upper(), logging.WARNING)
    if not isinstance(log_val, int):
        raise ValueError("Invalid log level")
    logging.basicConfig(level=log_val, force=True)

# start the client
if __name__ == "__main__":
    bot = ComradeBot()
    bot.begin()
