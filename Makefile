

.PHONY: clean venv run-web-dev
.DEFAULT_GOAL := run-web-dev


clean:
	rm -rf ./venv

venv: clean
	python3 -m venv venv
	touch .venv
	. venv/bin/activate; pip install --only-binary=:all: -I -e  .

venv-dev: clean
	python3 -m venv venv
	touch .venv
	. venv/bin/activate; pip install --only-binary=:all: -I -e  .[test]

run-web-dev:
	. venv/bin/activate; env JD_MODE=DEV fastapi dev frontenv/src/jdblog/main.py


run-web:
	. venv/bin/activate; fastapi run frontenv/src/jdblog/main.py


coverage-test:
	. venv/bin/activate; coverage run -m pytest -vv ; coverage report -m

