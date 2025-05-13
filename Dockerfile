
FROM python:3.11


WORKDIR /code

RUN python3 -m venv /opt/venv

COPY ./setup.py /code/setup.py
COPY ./backend /code/backend
COPY ./README.md /code/README.md
COPY ./static /code/static

RUN . /opt/venv/bin/activate && pip install --only-binary=:all: -I -e  .

CMD  . /opt/venv/bin/activate && exec fastapi run backend/src/jdblog/main.py --port 8000
