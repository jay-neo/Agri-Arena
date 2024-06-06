# Stage 1: Install Next.js dependencies and run in development mode
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
# COPY package*.json ./
COPY . .


RUN npm install

# Expose the port used by Next.js development server
EXPOSE 3000

# Run the Next.js development server
CMD ["npm", "run", "dev"]
