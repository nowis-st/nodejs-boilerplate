#!/bin/sh

# Set development environment
NODE_ENV=development

# Create log folder
mkdir logs

# Install dependancies
yarn install

# Run the server
npm run dev
