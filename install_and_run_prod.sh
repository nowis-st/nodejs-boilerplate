#!/bin/sh

# Set production environment
NODE_ENV=production

# Create log folder
mkdir logs

# Install dependancies
yarn install

# Run the server
npm run prod
