#!/bin/bash

echo "📦 Setting up environment files..."

# Root
if [ -f ./.env.example ]; then
  cp ./.env.example ./.env
  echo "✅ Root .env file created from .env.example"
else
  echo "⚠️  .env.example not found in root. Skipped."
fi

# Backend
if [ -f ./backend/.env.example ]; then
  cp ./backend/.env.example ./backend/.env
  echo "✅ Backend .env file created from .env.example"
else
  echo "⚠️  backend/.env.example not found. Skipped."
fi

# Frontend
if [ -f ./frontend/.env.example ]; then
  cp ./frontend/.env.example ./frontend/.env
  echo "✅ Frontend .env file created from .env.example"
else
  echo "⚠️  frontend/.env.example not found. Skipped."
fi

echo "🎉 All environment files have been set up!"
