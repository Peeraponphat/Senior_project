# Stage 1: Build the application
FROM node:latest as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock files to the working directory
COPY Web/package.json ./
COPY Web/package-lock.json ./

# Copy the rest of the application code
COPY Web .

# Install dependencies
RUN yarn install

# Build the application
RUN yarn run build

# Stage 2: Serve the built application using Nginx
FROM nginx:alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port your app runs on (change this to the port your application uses)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]