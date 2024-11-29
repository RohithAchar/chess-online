import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAMEOVER, INIT_GAME, MOVE, QUIT } from "./message";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({ type: INIT_GAME, payload: { color: "white" } })
    );
    this.player2.send(
      JSON.stringify({ type: INIT_GAME, payload: { color: "black" } })
    );
  }

  public makeMove(socket: WebSocket, move: { from: string; to: string }) {
    if (this.board.turn() === "w" && socket === this.player2) {
      console.log("It should be player 1 turn");
      return;
    }
    if (this.board.turn() === "b" && socket === this.player1) {
      console.log("It should be player 2 turn");
      return;
    }
    try {
      this.board.move(move);
    } catch (error) {
      console.log("[makeMove]: ", error);
      return;
    }

    if (this.board.isGameOver()) {
      const winner = this.board.turn() === "b" ? "white" : "black";
      this.player1.send(
        JSON.stringify({ type: GAMEOVER, payload: { winner: winner } })
      );
      this.player2.send(
        JSON.stringify({ type: GAMEOVER, payload: { winner: winner } })
      );
      return;
    }

    if (this.board.turn() === "w") {
      this.player1.send(JSON.stringify({ type: MOVE, payload: move }));
    } else {
      this.player2.send(JSON.stringify({ type: MOVE, payload: move }));
    }
  }

  public quit(socket: WebSocket) {
    if (socket === this.player1) {
      this.player2.send(JSON.stringify({ type: QUIT }));
    } else {
      this.player1.send(JSON.stringify({ type: QUIT }));
    }
  }
}
