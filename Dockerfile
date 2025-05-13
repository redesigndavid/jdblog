
FROM python:3.11


WORKDIR /code


COPY ./setup.py /code/setup.py
COPY ./backend /code/backend
COPY ./README.md /code/README.md
COPY ./static /code/static

RUN pip install --only-binary=:all: -I -e  .

CMD ["fastapi", "run", "backend/src/jdblog/main.py", "--port", "8000"]
