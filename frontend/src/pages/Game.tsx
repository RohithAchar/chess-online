import { useEffect, useState } from "react";
import { Chess } from "chess.js";

import useSocket from "../hooks/useSocket";
import Chessboard from "../components/chess-board";
import Loading from "../components/match-loading";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const QUIT = "quit";
export const GAMEOVER = "gameover";

const GamePage = () => {
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [myColor, setMyColor] = useState<null | "white" | "black">(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case INIT_GAME:
          setIsLoading(false);
          alert("Lets play!!");
          setChess(new Chess());
          console.log("init_game: ", message);
          setMyColor(message.payload.color);
          break;
        case MOVE:
          chess.move(message.payload);
          setBoard(chess.board());
          break;
        case GAMEOVER:
          alert(message.payload);
          setChess(new Chess());
          setBoard(new Chess().board());
          setMyColor(null);
          console.log("game_over", message);
          break;
        case QUIT:
          setMyColor(null);
          alert("Opponent quit the game 😑");
          setChess(new Chess());
          setBoard(new Chess().board());
          break;
      }
    };
    // Notify the server when the user refreshes or closes the page
    if (!myColor) {
      return;
    }
    const handleBeforeUnload = () => {
      if (socket && myColor) {
        socket.send(JSON.stringify({ type: QUIT }));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
  }, [socket, chess, board, isLoading, myColor]);

  if (!socket) {
    return <div>Connecting...</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid gird-cols-1 lg:grid-cols-3 gap-4 w-full max-w-screen-xl mx-auto px-6 pt-8">
      <Chessboard
        chess={chess}
        board={board}
        socket={socket}
        myColor={myColor}
        setBoard={setBoard}
      />
      <div className="bg-stone-900 h-full row-span-1 space-y-4">
        <button
          onClick={() => {
            setIsLoading(true);
            socket?.send(JSON.stringify({ type: INIT_GAME }));
          }}
          className="bg-[#81b64c] w-full py-5 rounded-lg text-2xl font-bold"
          hidden={myColor !== null}
        >
          Play 👍
        </button>
        <button
          onClick={() => {
            setMyColor(null);
            socket.send(JSON.stringify({ type: QUIT }));
          }}
          className="bg-[#b64c4c] w-full py-5 rounded-lg text-2xl font-bold"
          hidden={myColor === null}
        >
          Quit 😑
        </button>
        {chess.history().length > 0 && (
          <div className="flex gap-2 pb-4 px-4">
            {chess.history().map((move, index) => {
              return (
                <div
                  className="text-xs text-stone-300 bg-stone-700 px-2 rounded-full"
                  key={index}
                >
                  {move}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
