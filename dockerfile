# Backend: Use official Python image from DockerHub
FROM python:3.10-slim AS backend

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY crazel_backend/requirements.txt .

# Install the required packages for Django backend
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files to the container
COPY crazel_backend/ .

# Run migrations and collect static files for Django
RUN python manage.py collectstatic --noinput

# React: Build Stage for React App
FROM node:18-alpine AS frontend

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY crazel_frontend/package*.json ./

# Install dependencies for React frontend
RUN npm install

# Copy the rest of the React application files
COPY crazel_frontend/ .

# Build the React app
RUN npm run build

# Final Stage: Serve React app using Nginx, and Run Django backend
FROM nginx:alpine AS final

# Install necessary packages for running the Django app and Supervisor
RUN apk add --no-cache bash supervisor python3 py3-pip python3-dev musl-dev gfortran build-base openblas-dev linux-headers

# Set working directory for backend
WORKDIR /backend

# Create and activate a virtual environment using Python's venv module
RUN python3 -m venv /backend/venv

# Copy the backend files from the backend stage
COPY --from=backend /app /backend

# Set environment variables for OpenBLAS
ENV BLAS=openblas \
    OPENBLAS="$(apk info --installed | grep openblas)"

# Activate the virtual environment and install the requirements
RUN /backend/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy the built React app from the frontend stage
COPY --from=frontend /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file if needed (Optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Supervisor configuration to run both Django and Nginx
COPY supervisord.conf /etc/supervisord.conf

# Expose ports 80 (for Nginx) and 8000 (for Django backend)
EXPOSE 80 8000

# Start both services using Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
