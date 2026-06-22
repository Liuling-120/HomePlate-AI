.PHONY: help install dev-install run test lint format clean

help:
	@echo "HomePlate-AI - Make Commands"
	@echo "============================"
	@echo "make install      - Install dependencies"
	@echo "make dev-install  - Install with development dependencies"
	@echo "make run          - Run the application"
	@echo "make test         - Run tests"
	@echo "make lint         - Run linting checks"
	@echo "make format       - Format code with black"
	@echo "make clean        - Clean up cache files"

install:
	pip install -r requirements.txt

dev-install:
	pip install -r requirements.txt
	pip install -e ".[dev]"

run:
	python -m app.main

test:
	pytest tests/ -v --cov=app

lint:
	flake8 app tests
	mypy app

format:
	black app tests

clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache
	rm -rf .coverage
	rm -rf htmlcov
	rm -rf .mypy_cache
	rm -rf dist
	rm -rf build
	rm -rf *.egg-info
