# Set up node environment
FROM node:alpine

# Specify a working directory in container
WORKDIR /usr/src/app

# Install tools & dependencies
COPY ./package*.json ./
RUN npm install

# Copy application source-code and binaries
COPY ./ ./

# Configure environment variables

# Set a default command to be run when a container spins up
CMD ["npm", "run", "start"]
