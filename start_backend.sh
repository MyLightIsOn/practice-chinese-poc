#!/bin/bash
# Use absolute path instead of relative path
cd "$HOME/dev/practice-chinese-fastapi/"
source .venv/bin/activate  # if using virtual environment
uvicorn main:app --reload --host 0.0.0.0 --port 8000
