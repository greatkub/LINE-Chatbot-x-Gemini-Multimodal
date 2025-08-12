#!/bin/bash

# Azure Functions Deployment Script
# Make sure you have Azure CLI and Functions Core Tools installed

echo "🚀 Starting Azure Functions deployment..."

# Check if function app name is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide the function app name"
    echo "Usage: ./deploy.sh <function-app-name>"
    exit 1
fi

FUNCTION_APP_NAME=$1

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

echo "🚀 Deploying to Azure Functions..."
func azure functionapp publish $FUNCTION_APP_NAME

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your function is available at: https://$FUNCTION_APP_NAME.azurewebsites.net/api/webhook"
    echo "📝 Don't forget to set your environment variables in Azure Portal:"
    echo "   - API_KEY (Google Gemini API key)"
    echo "   - CHANNEL_ACCESS_TOKEN (LINE Channel Access Token)"
else
    echo "❌ Deployment failed!"
    exit 1
fi 