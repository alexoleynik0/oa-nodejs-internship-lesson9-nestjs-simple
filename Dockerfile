# Base image
FROM node:16-alpine

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Files required by pnpm install
COPY .npmrc package.json pnpm-lock.yaml ./

# Install app dependencies
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN pnpm build

# Expose the port
EXPOSE 8080

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
