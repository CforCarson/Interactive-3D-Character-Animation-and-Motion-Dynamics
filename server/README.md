# Naruto Universe Viewer - Server

This is the server component for the Naruto Universe Viewer application. It provides a backend for chat processing and scene state synchronization.

## Features

- API endpoint for chat processing
- Scene state synchronization for future multiplayer functionality
- Server status monitoring

## Requirements

- Node.js (v14+ recommended)
- npm or yarn

## Installation

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

## Running the Server

### Development Mode

```
npm run dev
```
or
```
yarn dev
```

This will start the server with nodemon, which automatically restarts when you make changes to the code.

### Production Mode

```
npm start
```
or
```
yarn start
```

## API Endpoints

The server exposes the following API endpoints:

- `POST /api/chat` - Process chat messages through the OpenAI API
- `POST /api/scene-state` - Update scene state for synchronization
- `GET /api/status` - Check server status

## Client Integration

The client automatically connects to the server when it starts. If the server is not available, the client falls back to local mode and will display "Server Status: Offline" in the UI.

## Environment Variables

- `PORT` - Port number for the server (default: 3000)

## Future Enhancements

- User authentication
- Persistent scene state for multiplayer
- WebSocket support for real-time updates 