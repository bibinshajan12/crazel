# Use a stable version of Flutter and install Node.js v18
FROM cirrusci/flutter:stable

# Install Node.js (v18) and npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Upgrade npm to the latest version compatible with Node.js v18
RUN npm install -g npm@latest

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/
RUN npm install

# Copy the rest of the application code
COPY . /app/

# Ensure Flutter dependencies are ready
RUN flutter precache
RUN flutter pub get

# Expose the port (adjust if necessary)
EXPOSE 5001

# Start the application
CMD ["node", "server.js"]
