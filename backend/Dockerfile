# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build if needed (TypeScript)
RUN npm run build

# Start the server
CMD ["npm", "run", "dev"]
