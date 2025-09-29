# 🐀 AI Rat Video Generator

An AI-powered web application for generating creative rat videos using advanced video generation models. Built with React, TypeScript, and Subscribe.dev.

## Features

- **AI Video Generation**: Create unique rat videos using state-of-the-art AI models (wan-video/wan-2.2-5b-fast)
- **Customizable Output**: Choose from multiple aspect ratios (16:9, 1:1, 9:16)
- **Generation History**: Automatically saves your last 10 generated videos with cloud sync
- **Authentication & Billing**: Integrated user authentication and subscription management via Subscribe.dev
- **Usage Tracking**: Real-time credit balance and plan status display
- **Responsive Design**: Beautiful, modern UI that works on desktop and mobile devices

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Subscribe.dev** - Authentication, billing, and AI model access
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Subscribe.dev account and project token

### Installation

1. Clone the repository:
```bash
git clone https://github.com/v-vibers/ai-rat-video-generator.git
cd ai-rat-video-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your Subscribe.dev project token to `.env`:
```
VITE_SUBSCRIBE_DEV_PROJECT_TOKEN=your_project_token_here
```

Get your project token from the [Subscribe.dev dashboard](https://subscribe.dev).

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Usage

1. **Sign In**: Click the "Sign In to Start Creating" button on the landing page
2. **Generate**: Enter a prompt describing what the rat should do (e.g., "dancing in a disco")
3. **Choose Aspect Ratio**: Select your preferred video format
4. **Create**: Click "Generate Video" and wait for the AI to create your video
5. **View History**: Access your previously generated videos in the history section

## Project Structure

```
src/
├── components/
│   ├── SignInScreen.tsx       # Unauthenticated landing page
│   └── RatVideoGenerator.tsx  # Main video generation interface
├── App.tsx                     # Root component with auth routing
├── main.tsx                    # Entry point with SubscribeDevProvider
├── App.css                     # Component styles
└── index.css                   # Global styles
```

## Architecture

This app follows the **component separation pattern** recommended by Subscribe.dev:

- **SignInScreen**: Rendered when user is not authenticated
- **RatVideoGenerator**: Rendered when user is authenticated, with access to all Subscribe.dev hooks

This pattern ensures React hooks are called consistently and avoids conditional hook calls.

## Key Features Implementation

### Video Generation
Uses the `wan-video/wan-2.2-5b-fast` model via Subscribe.dev's client:
```typescript
const response = await client.run('wan-video/wan-2.2-5b-fast', {
  input: {
    prompt: 'A rat dancing in a disco',
    aspect_ratio: '16:9'
  }
});
```

### Cloud-Synced Storage
Utilizes Subscribe.dev's `useStorage` hook for persisting generation history:
```typescript
const [history, setHistory, syncStatus] = useStorage('rat-video-history', {
  videos: []
});
```

### Error Handling
Comprehensive error handling for:
- Insufficient credits (with upgrade prompt)
- Rate limits (with retry timer)
- Network errors (with retry option)

## Contributing

This application was created using VGit AI-powered development tools.

## License

MIT

## VGit Workflows

This repository includes the following VGit workflows:

- **Create Feature**: Implement new features using AI assistance
- **Ask Codebase**: Get AI-powered answers about your code
- **Merge Branch**: Safely merge branches with validation
- **Deploy Preview**: Automated preview deployments

---

*Generated with [VGit](https://vgit.app) 🤖*
