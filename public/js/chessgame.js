const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

/**
 * Initialize the board by creating the grid and adding event listeners.
 */
const initializeBoard = () => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (row + col) % 2 === 0 ? "light" : "dark"
      );
      squareElement.dataset.row = row;
      squareElement.dataset.col = col;

      // Add event listeners for drag and drop
      squareElement.addEventListener("dragover", onDragOver);
      squareElement.addEventListener("drop", onDrop);

      boardElement.appendChild(squareElement);
    }
  }
};

/**
 * Render the current board state and update piece positions.
 */
const renderBoard = () => {
  const board = chess.board();
  document.querySelectorAll(".square").forEach((squareElement) => {
    const row = squareElement.dataset.row;
    const col = squareElement.dataset.col;
    const square = board[row][col];

    squareElement.innerHTML = ""; // Clear previous piece

    if (square) {
      const pieceElement = document.createElement("div");
      pieceElement.classList.add(
        "piece",
        square.color === "w" ? "white" : "black"
      );
      pieceElement.innerText = getPieceUnicode(square);
      pieceElement.draggable = playerRole === square.color; // Only draggable by the player of that color

      // Add event listeners for dragging
      pieceElement.addEventListener("dragstart", onDragStart);
      pieceElement.addEventListener("dragend", onDragEnd);

      squareElement.appendChild(pieceElement);
    }
  });

  boardElement.classList.toggle("flipped", playerRole === "b");
};

/**
 * Handle the drag start event for a piece.
 */
const onDragStart = (e) => {
  draggedPiece = e.target;
  sourceSquare = {
    row: parseInt(draggedPiece.parentElement.dataset.row),
    col: parseInt(draggedPiece.parentElement.dataset.col),
  };
  e.dataTransfer.setData("text/plain", ""); // Required for drag-and-drop to work
};

/**
 * Handle the drag end event.
 */
const onDragEnd = () => {
  draggedPiece = null;
  sourceSquare = null;
};

/**
 * Handle the drag over event (prevent default to allow drop).
 */
const onDragOver = (e) => {
  e.preventDefault();
};

/**
 * Handle the drop event for a square.
 */
const onDrop = (e) => {
  e.preventDefault();
  if (!draggedPiece) return;

  const targetSquare = {
    row: parseInt(e.target.dataset.row),
    col: parseInt(e.target.dataset.col),
  };

  handleMove(sourceSquare, targetSquare);
};

/**
 * Handle a move made by the player.
 */
const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q", // Default promotion to queen
  };

  const result = chess.move(move);
  if (result) {
    socket.emit("move", move);
    renderBoard(); // Re-render the board after a valid move
  } else {
    console.error("Invalid move", move);
  }
};

/**
 * Get the Unicode representation of a chess piece.
 */
const getPieceUnicode = (piece) => {
  const unicodePieces = {
    p: "♙",
    r: "♖",
    n: "♘",
    b: "♗",
    q: "♕",
    k: "♔",
    P: "♟",
    R: "♜",
    N: "♞",
    B: "♝",
    Q: "♛",
    K: "♚",
  };
  return unicodePieces[piece.type] || "";
};

// Socket event handlers

socket.on("playerRole", (role) => {
  playerRole = role;
  renderBoard();
});

socket.on("spectatorRole", () => {
  playerRole = null;
  renderBoard();
});

socket.on("boardState", (fen) => {
  chess.load(fen);
  renderBoard();
});

socket.on("move", (move) => {
  chess.load(move);
  renderBoard();
});

// Initialize board and render the initial state
initializeBoard();
renderBoard();
