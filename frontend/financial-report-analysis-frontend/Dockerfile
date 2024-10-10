# Use the official Node.js image from the Docker Hub
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY package.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Command to run the React application
CMD ["npm", "run", "dev"]

# docker build -t financial-report-analysis-frontend . --no-cache
# docker run -p 3000:3000 financial-report-analysis-frontend
