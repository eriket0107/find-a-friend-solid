# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose the port Fastify will run on
EXPOSE 3333

# Command to start the Fastify application
CMD ["yarn", "start"]