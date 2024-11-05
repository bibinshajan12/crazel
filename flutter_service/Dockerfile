# Use a base Debian image
FROM debian:buster

# Install dependencies
RUN apt-get update && apt-get install -y \
  curl \
  git \
  unzip \
  xz-utils \
  zip \
  libglu1-mesa \
  python3 \
  python3-pip

# Download and install Flutter
RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter \
  && /usr/local/flutter/bin/flutter --version

# Set PATH for Flutter
ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Enable Flutter web support
RUN flutter config --enable-web

# Switch to the stable channel and upgrade Flutter
RUN flutter channel stable
RUN flutter upgrade

# Install Flask and other Python dependencies
COPY requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r /app/requirements.txt

# Set the working directory
WORKDIR /app

# Copy the entire project, including pubspec.yaml, flask app, and bin/
COPY . .

# Run Flutter clean and pub get to prepare the Flutter project
RUN flutter clean
RUN flutter pub get

# Expose the Flask and Flutter service ports
EXPOSE 8080 5000

# Run the Flask API and Flutter service together
# Run the Flask app on port 5000 and Flutter service on port 8080
CMD ["bash", "-c", "python3 run.py & dart bin/flutter_service.dart"]
