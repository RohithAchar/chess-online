import { WebSocket } from "ws";
import { INIT_GAME, MOVE, QUIT } from "./message";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: WebSocket | null;
  private users: WebSocket[];

  constructor() {
    this.games = [];
    this.pendingUser = null;
    this.users = [];
  }

  public addUser(socket: WebSocket) {
    this.users.push(socket);
    this.addHandler(socket);
  }

  public removeUser(socket: WebSocket) {
    console.log("Removing user: ", socket);
    this.users.filter((user) => user !== socket);
    this.games = this.games.filter(
      (game) => game.player1 !== socket && game.player2 !== socket
    );
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.type === INIT_GAME) {
        if (this.pendingUser) {
          this.games.push(new Game(this.pendingUser, socket));
          this.pendingUser = null;
        } else {
          this.pendingUser = socket;
        }
      }

      if (message.type === MOVE) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.makeMove(socket, message.move);
        }
      }

      if (message.type === QUIT) {
        const game = this.games.find(
          (game) => game.player1 === socket || game.player2 === socket
        );
        if (game) {
          game.quit(socket);
        }
        this.games = this.games.filter(
          (game) => game.player1 !== socket && game.player2 !== socket
        );
      }
    });
  }
}
