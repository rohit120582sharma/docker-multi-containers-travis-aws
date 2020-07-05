# Set up node environment
FROM node:14.4.0

# Specify a working directory in container
WORKDIR /usr/src/app

# Install tools & dependencies
COPY ./package*.json ./
RUN npm install

# Copy application source-code and binaries
COPY ./ ./

# Configure the environment variables

# Build production application
RUN npm run build

# Change an environment to web-server
FROM nginx

# Expose the port for network access
EXPOSE 3000

# Change the default configuration
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the production build to be served as static web application
COPY --from=0 /usr/src/app/build /usr/share/nginx/html
