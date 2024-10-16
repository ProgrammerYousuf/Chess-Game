# Chess Game with Express, Socket.io, Chess.js, and Tailwind CSS

This is a real-time multiplayer chess game built using **Express.js**, **Socket.io**, **Chess.js**, and styled with **Tailwind CSS**. The game allows two players (one as white and one as black) to play chess, while spectators can observe the game. The game enforces chess rules and updates the board in real-time for all connected users.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [License](#license)

## Features
- **Multiplayer Support**: Two players can join as white or black.
- **Real-Time Updates**: The game updates in real time for all players and spectators.
- **Chess Rule Enforcement**: Chess.js enforces all game rules, including valid moves and turns.
- **Spectator Mode**: Spectators can join and watch the game.
- **Responsive Design**: The UI is fully responsive using **Tailwind CSS**.
- **Drag-and-Drop Functionality**: Players can drag and drop pieces to make moves.

## Technologies Used
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building the server.
- **Socket.io**: Library for real-time communication between server and clients.
- **Chess.js**: JavaScript library to manage chess logic and validate moves.
- **EJS**: Embedded JavaScript templates for rendering views.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **CSS/JavaScript**: Frontend technologies for the chessboard and user interactions.

## Setup

### Prerequisites
- **Node.js** installed (version 12+).
- **npm** installed (comes with Node.js).
- **Tailwind CSS**: Installed and configured in the project for styling.

### Steps
## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/chess-game.git
   cd chess-game
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```