# Use the official Node.js 18 image from the Docker Hub
FROM node:22

# Set the working directory to /app inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install any necessary dependencies using npm
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Expose the port that your application runs on (3001 in this case)
EXPOSE 3031

# Define the command to run your application when the container starts
CMD ["node", "index.js"]