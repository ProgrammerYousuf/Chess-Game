const express = require("express");
const app = express();
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const server = http.createServer(app);
const chess = new Chess();
const io = socket(server);

let players = {
  white: null,
  black: null,
};

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

// Socket.io connection handler
io.on("connection", (uniquesocket) => {
  console.log("A user connected: ", uniquesocket.id);

  // Assign player roles
  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
    console.log("White player assigned: ", uniquesocket.id);
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
    console.log("Black player assigned: ", uniquesocket.id);
  } else {
    uniquesocket.emit("spectatorRole");
    console.log("Spectator connected: ", uniquesocket.id);
  }

  // Handle moves from players
  uniquesocket.on("move", (move) => {
    try {
      const currentTurn = chess.turn();
      const playerId = uniquesocket.id;

      // Ensure only the correct player can make a move
      if (currentTurn === "w" && playerId !== players.white) return;
      if (currentTurn === "b" && playerId !== players.black) return;

      const result = chess.move(move);

      if (result) {
        io.emit("move", move); // Broadcast the move to all players and spectators
        io.emit("boardState", chess.fen()); // Send updated board state
        console.log(`Move made: ${move.from} -> ${move.to}`);
      } else {
        uniquesocket.emit("invalidMove", move); // Inform player of invalid move
        console.log("Invalid move: ", move);
      }
    } catch (err) {
      console.error("Error processing move: ", err);
      uniquesocket.emit("error", "Invalid move");
    }
  });

  // Handle player disconnect
  uniquesocket.on("disconnect", () => {
    console.log("A user disconnected: ", uniquesocket.id);

    // Remove player from the game if they are white or black
    if (uniquesocket.id === players.white) {
      players.white = null;
      console.log("White player disconnected");
    } else if (uniquesocket.id === players.black) {
      players.black = null;
      console.log("Black player disconnected");
    }

    // Notify remaining players/spectators of updated board state
    io.emit("boardState", chess.fen());
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
