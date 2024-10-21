# Use official Python image from DockerHub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file to the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . .

# Expose the port Django will run on
EXPOSE 8000

# Run makemigrations, migrate, and start the Django development server
# CMD ["sh", "-c", "python manage.py makemigrations && python manage.py migrate && python manage.py runserver 127.0.0.1:8000"]
CMD ["sh", "-c", "python manage.py collectstatic --noinput && python manage.py migrate && gunicorn crazel_backend.wsgi:application --bind 0.0.0.0:8000"]

