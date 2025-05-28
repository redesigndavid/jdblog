import hashlib
from typing import Annotated

import requests
from fastapi import APIRouter, Depends

router = APIRouter()

import boto3
import botocore.client

from jdblog.config import config


def get_s3_client():
    """Get an S3 client."""
    session = boto3.Session(
        aws_access_key_id=config.get("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=config.get("AWS_SECRET_ACCESS_KEY"),
    )
    client = session.client(
        "s3",
        region_name=config.get("AWS_REGION_NAME"),
        endpoint_url=config.get("AWS_ENDPOINT_URL"),
    )
    return client


def get_url_content(url) -> bytes:
    """Get url content."""
    response = requests.get(url, stream=True)
    response.raise_for_status()
    return response.content


@router.get("/static")
def get_presigned_url(
    path: str,
    s3_client: Annotated[botocore.client.BaseClient, Depends(get_s3_client)],
):
    """Get presigned s3 url for image."""
    hash = hashlib.md5(string=bytes(path, encoding="utf8")).hexdigest()

    if not s3_client.list_objects_v2(
        Bucket=config.get("AWS_BUCKET_NAME"),
        Prefix=hash,
    ).get("Contents"):
        content = get_url_content(path)
        s3_client.put_object(
            Body=content,
            Key=hash,
            Bucket=config.get("AWS_BUCKET_NAME"),
        )

    return s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": "redesigndavid", "Key": hash},
        ExpiresIn=3600,
    )
