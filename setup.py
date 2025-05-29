#!/usr/bin/env python

"""The setup script."""
import pathlib

from setuptools import find_packages, setup

with open("README.md") as readme_file:
    readme = readme_file.read()

requirements = [
    "psycopg2-binary",
    "click",
    "fastapi[all]",
    "uvicorn[standard]",
    "fastapi",
    "sqlmodel",
    "python-multipart",
    "PyJWT",
    "requests[security]",
    "bcrypt",
    "pymongo",  # needed to install bson.json_utils.
    "luqum",
    "authlib",
    "boto3",
]
dev_requirements = [
    "pytest>=3",
    "pytest-mock",
    "coverage",
    "isort",
    "pip",
    "ruff",
    "asyncmock",
    "pytest-asyncio",
]

setup(
    author="David Marte",
    author_email="redesigndavid@gmail.com",
    python_requires=">=3.6",
    description="AIA CRM API",
    entry_points={
        "console_scripts": [],
    },
    install_requires=requirements,
    license="MIT license",
    long_description=readme + "\n\n",
    include_package_data=True,
    keywords="AIA CRM",
    name="jdblog",
    packages=find_packages(where=pathlib.Path("./backend/src"), include=["jdblog"]),
    package_dir={"": "backend/src"},
    test_suite="tests",
    extras_require={"test": dev_requirements},
    version="0.1.0",
    zip_safe=False,
)
