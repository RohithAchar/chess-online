import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";

import { MOVE } from "../pages/Game";

import pawnImg from "../assets/black/p.svg";
import rookImg from "../assets/black/r.svg";
import knightImg from "../assets/black/n.svg";
import bishopImg from "../assets/black/b.svg";
import queenImg from "../assets/black/q.svg";
import kingImg from "../assets/black/k.svg";

import pawnImg2 from "../assets/white/p.svg";
import rookImg2 from "../assets/white/r.svg";
import knightImg2 from "../assets/white/n.svg";
import bishopImg2 from "../assets/white/b.svg";
import queenImg2 from "../assets/white/q.svg";
import kingImg2 from "../assets/white/k.svg";

const blackImages: { [key in PieceSymbol]: string } = {
  p: pawnImg,
  r: rookImg,
  n: knightImg,
  b: bishopImg,
  q: queenImg,
  k: kingImg,
};

const whiteImages: { [key in PieceSymbol]: string } = {
  p: pawnImg2,
  r: rookImg2,
  n: knightImg2,
  b: bishopImg2,
  q: queenImg2,
  k: kingImg2,
};

const Chessboard = ({
  chess,
  board,
  socket,
  myColor,
  setBoard,
}: {
  chess: Chess;
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  setBoard: (
    board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][]
  ) => void;
  myColor: null | "white" | "black";
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | string>(null);
  const [isMove, setIsMove] = useState<boolean>(false);

  useEffect(() => {
    if (myColor === "white" && chess.turn() === "w") {
      setIsMove(true);
    }
    if (myColor === "black" && chess.turn() === "b") {
      setIsMove(true);
    }
  }, [chess, board]);

  const getSquareName = (row: number, col: number) => {
    const files = myColor === "white" ? "abcdefgh" : "hgfedcba";
    const ranks = "87654321";
    return `${files[col]}${ranks[row]}`;
  };

  const onCellClick = (square: string | null) => {
    if (from === null) {
      setFrom(square);
      return;
    }

    if (from && square) {
      try {
        chess.move({ from: from, to: square });
        setBoard(chess.board());
        socket.send(
          JSON.stringify({ type: MOVE, move: { from: from, to: square } })
        );
        setIsMove(false);
      } catch (error) {
        console.error("Invalid move: ", error);
      }
      setFrom(null);
    }
  };

  const adjustedBoard = myColor === "white" ? board : [...board].reverse(); // Flip rows for black player

  return (
    <div className="bg-white w-full aspect-square lg:col-span-2 grid grid-cols-1 grid-rows-8">
      {adjustedBoard.map((cols, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-8">
          {cols.map((cell, colIndex) => {
            const adjustedColIndex =
              myColor === "white" ? colIndex : 7 - colIndex; // Flip columns for black player
            const square = getSquareName(
              myColor === "white" ? rowIndex : 7 - rowIndex, // Adjust row index for black player
              adjustedColIndex
            );
            const isHighlighted = square === from; // Check if the square is the selected "from" square
            const squareColor =
              (rowIndex + adjustedColIndex) % 2 === 0
                ? "bg-[#BBBFCA] text-black"
                : "bg-[#444] text-white";
            const highlightStyle = isHighlighted ? "bg-yellow-300" : ""; // Highlight the "from" square
            const hoverEffect = isMove ? "hover:scale-105 hover:shadow-lg" : "";
            const animation = "transition-transform duration-100 ease-in-out";
            const cursor = isMove ? "cursor-pointer" : "cursor-not-allowed";

            return (
              <div
                key={colIndex}
                className={`relative flex items-center justify-center ${cursor} ${squareColor} ${highlightStyle} ${hoverEffect} ${animation}`}
                onClick={() => {
                  if (!isMove) return;
                  onCellClick(square);
                }}
              >
                {cell?.type && (
                  <img
                    src={
                      cell.color === "b"
                        ? blackImages[cell.type]
                        : whiteImages[cell.type]
                    }
                    alt="pawn"
                    className="w-[60%] fill-red-600"
                  />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;
