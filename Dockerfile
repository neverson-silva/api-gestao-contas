# Base image
FROM node:19.9.0-buster

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE 9090

# Start the server using the production build
CMD [ "node", "/app/dist/main.js" ]
