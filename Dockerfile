# Enginuity Cloud Backend - Development Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]
