# Use a lightweight Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies with caching
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the project (e.g., TypeScript)
RUN yarn build

# Expose the port used by Fastify
EXPOSE 3333

# Set production environment
ENV NODE_ENV=production

# Start the application (from built files)
CMD ["yarn", "start"]
