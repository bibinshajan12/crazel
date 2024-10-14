# Stage 1: Build Flutter Web App
FROM cirrusci/flutter:latest AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Flutter project files to the container
COPY . .

# Install dependencies
RUN flutter pub get

# Build the Flutter web app
RUN flutter build web

# Stage 2: Serve the Flutter Web App with Nginx
FROM nginx:alpine

# Copy the built Flutter web files from the build stage to the Nginx public directory
COPY --from=build /app/build/web /usr/share/nginx/html

# Expose port 80 to serve the app
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
