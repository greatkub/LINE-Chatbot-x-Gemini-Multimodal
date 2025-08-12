# LINE Chatbot with Gemini Multimodal on Azure Functions

A LINE chatbot that uses Google's Gemini AI to process multimodal content (images, videos, audio, PDFs) and answer questions about them.

## Features

- **Multimodal Processing**: Handles PDF, JPEG, PNG, WAV, MP3, MP4, and MOV files
- **AI-Powered Responses**: Uses Google Gemini 2.5 Flash for intelligent content analysis
- **LINE Integration**: Seamless integration with LINE messaging platform
- **Azure Functions**: Serverless deployment on Microsoft Azure
- **TypeScript**: Full TypeScript support with proper type definitions

## Architecture

- **Azure Functions**: Serverless compute for handling webhook requests
- **Google Gemini AI**: Multimodal AI model for content analysis
- **LINE Bot API**: Messaging platform integration
- **Node.js**: Runtime environment with TypeScript support

## Project Structure

```
├── src/
│   ├── webhook/
│   │   ├── function.json    # Azure Functions binding configuration
│   │   └── index.ts         # Main webhook handler
│   └── utils/
│       ├── gemini.ts        # Gemini AI integration
│       └── request.ts       # LINE API utilities
├── host.json                # Azure Functions host configuration
├── local.settings.json      # Local development settings
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── azure-deploy.md          # Deployment instructions
```

## Prerequisites

- Node.js 18+
- Azure CLI
- Azure Functions Core Tools
- Google Gemini API key
- LINE Channel Access Token

## Quick Start

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   - Copy `local.settings.json` and add your API keys
   - Set `API_KEY` (Google Gemini)
   - Set `CHANNEL_ACCESS_TOKEN` (LINE)

3. **Build and run locally**

   ```bash
   npm run build
   npm start
   ```

4. **Deploy to Azure**
   ```bash
   func azure functionapp publish your-function-app-name
   ```

## Configuration

### Environment Variables

- `API_KEY`: Your Google Gemini API key
- `CHANNEL_ACCESS_TOKEN`: Your LINE Channel Access Token

### LINE Webhook Setup

1. Set your webhook URL in LINE Developer Console
2. URL format: `https://your-function-app-name.azurewebsites.net/api/webhook`
3. Enable webhook verification if required

## API Endpoints

- **POST** `/api/webhook` - Main webhook endpoint for LINE events

## Supported File Types

- **Documents**: PDF
- **Images**: JPEG, PNG
- **Audio**: WAV, MP3, M4A
- **Video**: MP4, MOV

## Development

### Local Development

```bash
npm run build    # Build TypeScript
npm start        # Start local development server
```

### Testing

- Use ngrok to expose localhost for LINE webhook testing
- Test with various file types and text prompts

## Deployment

See [azure-deploy.md](azure-deploy.md) for detailed deployment instructions.

## Monitoring

- Azure Application Insights integration
- Function logs in Azure Portal
- Performance metrics and error tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
