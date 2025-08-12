# Azure Functions Deployment Guide

## Prerequisites

1. Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
2. Install Azure Functions Core Tools: https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#install-the-azure-functions-core-tools
3. Node.js 18+ installed

## Setup

1. **Login to Azure**

   ```bash
   az login
   ```

2. **Create Resource Group** (if not exists)

   ```bash
   az group create --name your-resource-group --location eastus
   ```

3. **Create Storage Account** (required for Azure Functions)

   ```bash
   az storage account create --name yourstorageaccount --location eastus --resource-group your-resource-group --sku Standard_LRS
   ```

4. **Create Function App**
   ```bash
   az functionapp create --resource-group your-resource-group --consumption-plan-location eastus --runtime node --runtime-version 18 --functions-version 4 --name your-function-app-name --storage-account yourstorageaccount --os-type Linux
   ```

## Environment Variables

Set the required environment variables in Azure:

```bash
az functionapp config appsettings set --name your-function-app-name --resource-group your-resource-group --settings "API_KEY=your-gemini-api-key" "CHANNEL_ACCESS_TOKEN=your-line-channel-access-token"
```

## Build and Deploy

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Build the project**

   ```bash
   npm run build
   ```

3. **Deploy to Azure**
   ```bash
   func azure functionapp publish your-function-app-name
   ```

## Local Development

1. **Start local development**

   ```bash
   npm start
   ```

2. **Test locally**
   - The function will be available at: `http://localhost:7071/api/webhook`
   - Use tools like ngrok to expose localhost for LINE webhook testing

## Configuration

- **Function URL**: After deployment, your function will be available at: `https://your-function-app-name.azurewebsites.net/api/webhook`
- **LINE Webhook URL**: Set this URL in your LINE Developer Console
- **Authentication**: The function uses anonymous authentication by default

## Monitoring

- Use Azure Application Insights for monitoring and logging
- View function logs in Azure Portal or using Azure CLI
- Monitor performance and errors in the Azure Functions dashboard
