FROM node:20-slim

# Set node environment
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package descriptors
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production --silent

# Copy server code
COPY . .

# Secure container by running as non-root user
USER node

EXPOSE 5000

CMD ["node", "server.js"]
