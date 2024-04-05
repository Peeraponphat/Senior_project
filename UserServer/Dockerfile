# Use the official Node.js 18 base image with Alpine Linux
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/app

# Install JDK
RUN apk add --no-cache openjdk11

# Install yarn if not already installed
RUN command -v yarn || npm install yarn --global

# Copy package.json and package-lock.json
COPY UserServer/package.json ./
COPY UserServer/package-lock.json ./

# Install dependencies
RUN npm install

# Copy remaining application files
COPY  UserServer .

# Install PM2 globally
RUN npm install pm2 -g

# Expose the port your app runs on
EXPOSE 3001

# Start the application with PM2
CMD ["pm2-runtime", "npm", "--", "start"]
