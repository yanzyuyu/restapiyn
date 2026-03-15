# Dockerfile for Railway (or any Docker-based deployment)
# Ensures Python 3 is available for youtube-dl-exec (yt-dlp) + runs the Node server.

FROM node:20-bullseye

# Install python3 (required by yt-dlp when invoked via youtube-dl-exec)
RUN apt-get update \
  && apt-get install -y python3 python3-distutils \
  && ln -sf /usr/bin/python3 /usr/bin/python \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package manifest first to enable Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --silent

# Copy application code
COPY . ./

# Build frontend (optional, but useful for production)
RUN npm run build

# Default port and command
EXPOSE 3000
CMD ["npm", "start"]
