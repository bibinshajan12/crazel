# Backend: Use official Python image from DockerHub for Django and Flask
FROM python:3.10-slim AS backend

# Set the working directory for Django and Flask
WORKDIR /app

# Copy the requirements file for Django and Flask to the container
COPY crazel_backend/requirements.txt crazel_backend/
COPY flutter_service/requirements.txt flutter_service/

# Install the required packages for Django backend and Flask
RUN pip install --no-cache-dir -r crazel_backend/requirements.txt
RUN pip install --no-cache-dir -r flutter_service/requirements.txt

# Copy the Django backend files and Flask files to the container
COPY crazel_backend/ crazel_backend/
COPY flutter_service/ flutter_service/

# Run migrations and collect static files for Django
RUN python3 crazel_backend/manage.py collectstatic --noinput

# Frontend: Use Node.js image to build the React frontend
FROM node:18-alpine AS frontend

# Set working directory for the React app
WORKDIR /app

# Copy package.json and package-lock.json for React app
COPY crazel_frontend/package*.json ./

# Install dependencies for React frontend
RUN npm install

# Copy the rest of the React app files
COPY crazel_frontend/ .

# Build the React app
RUN npm run build

# Final Stage: Use Debian Bullseye slim image to combine Flutter, Flask, Django, and React
FROM debian:bullseye-slim AS final

# Install dependencies for Flutter and Nginx
RUN apt-get update && apt-get install -y \
  curl \
  git \
  unzip \
  xz-utils \
  zip \
  libglu1-mesa \
  python3 \
  python3-pip \
  python3-venv \
  nginx \
  supervisor \
  vim \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Flutter SDK
RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter \
  && /usr/local/flutter/bin/flutter --version

# Set PATH for Flutter
ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Enable Flutter web support
RUN flutter config --enable-web

# Switch to the stable channel and upgrade Flutter
RUN flutter channel stable
RUN flutter upgrade

# Set up persistent build directory for Flutter web apps
RUN mkdir -p /usr/share/nginx/html/flutter_apps

# Set working directory for backend
WORKDIR /backend

# Create and activate a virtual environment using Python's venv module
RUN python3 -m venv /backend/venv

# Copy the Django backend and Flask service files from the backend stage
COPY --from=backend /app/crazel_backend /backend/crazel_backend
COPY --from=backend /app/flutter_service /backend/flutter_service

# Install setuptools and wheel in virtual environment
RUN /backend/venv/bin/pip install --no-cache-dir setuptools wheel

# Install Python requirements inside the virtual environment for Django and Flask
RUN /backend/venv/bin/pip install --no-cache-dir -r /backend/crazel_backend/requirements.txt
RUN /backend/venv/bin/pip install --no-cache-dir -r /backend/flutter_service/requirements.txt

# Set working directory for the Flutter service
WORKDIR /flutter_service

# Copy the Flutter service files
COPY flutter_service/ .

# Run Flutter clean and pub get
RUN flutter clean
RUN flutter pub get

# Copy the built React app from the frontend stage to Nginx
COPY --from=frontend /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file (to handle routes for Flutter previews)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy sample app from for demo
COPY flutter_service/workspace/snakeandladderdemo/build/web /usr/share/nginx/html/snakeandladderdemo/web
COPY flutter_service/workspace/gesture/build/web /usr/share/nginx/html/gesture/web

# Copy Supervisor configuration to run Django, Flask, Flutter, and Nginx
COPY supervisord.conf /etc/supervisord.conf

# Expose ports for Nginx, Django, Flask, and Flutter services
EXPOSE 80 8000 5000 8080

# Start all services using Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
