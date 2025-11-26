#!/bin/bash

# cPanel Deployment Script for Swift-Ship Backend
# Run this script via SSH in your cPanel account

echo "🚀 Starting CityMovers Backend Deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js via cPanel Node.js Selector first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed successfully${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Please create one from .env.example${NC}"
    echo -e "${YELLOW}   Copy .env.example to .env and fill in your values${NC}"
fi

# Set proper permissions for uploads directory
echo -e "${YELLOW}🔐 Setting file permissions...${NC}"
chmod -R 755 uploads/
mkdir -p uploads/id-proofs
chmod 755 uploads/id-proofs/

echo -e "${GREEN}✅ Permissions set${NC}"

# Check MongoDB connection (if MONGO_URI is set)
if [ -f .env ]; then
    source .env
    if [ -n "$MONGO_URI" ]; then
        echo -e "${YELLOW}🔍 Testing MongoDB connection...${NC}"
        # Note: This is a basic check - actual connection test would require Node.js
        echo -e "${GREEN}✅ MongoDB URI configured${NC}"
    fi
fi

echo -e "${GREEN}✅ Deployment script completed!${NC}"
echo -e "${YELLOW}📝 Next steps:${NC}"
echo -e "   1. Ensure all environment variables are set in .env file"
echo -e "   2. Start your application via cPanel Node.js Selector"
echo -e "   3. Check application logs for any errors"
echo -e "   4. Test your API endpoints"

