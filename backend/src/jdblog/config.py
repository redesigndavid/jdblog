import sys

from starlette.config import Config

config = Config(".env")
if "dev" in sys.argv:
    config = Config(".env.development")
