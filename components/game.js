import Board from "./board.js";
import { player1, player2 } from "./players.js";
import { weapons } from "./weapons.js";

export default class Game {
  constructor(turnToPlay) {
    this.turnToPlay = turnToPlay;
  }
  /* Cette méthode initialise le jeu en créant la grille de jeu et en lançant la méthode gamePlay */
  init() {
    let height = 10;
    let width = 10;
    let players = [player1, player2];

    players.forEach(player => {
      this.playersDescription(player);
    });

    this.board = new Board(player1, player2, weapons);
    this.board.createGrid(width, height);
    console.log(this.board.cells);

    this.board.getAccessibleCells(player1.currentCell, 3);
    this.gamePlay();
  }

  /* Cette méthode gère les tours de jeu et lance d'autre méthode relative au bon fonctionnement du jeu */
  gamePlay() {
    let self = this;
    $("#board").on("click", ".accessible", function() {
      let adjacentCells = self.board.getAdjacentCells(
        self.board.cells[$(this).data("x")][$(this).data("y")]
      );
      let boardCell = self.board.cells[$(this).data("x")][$(this).data("y")];
      let currentPlayer = self.turnToPlay ? player1 : player2;
      let nextPlayer = self.turnToPlay ? player2 : player1;
      self.playerActions(currentPlayer, boardCell, adjacentCells);
      self.playersDescription(currentPlayer);
      self.board.getAccessibleCells(nextPlayer.currentCell, 3);
    });
  }

  /* Cette méthode gère les différentes actions des joueurs */
  playerActions(player, boardCell, adjacentCells) {
    player.move(boardCell);
    player.changeWeapon(player);
    if (player.isPlayerAround(adjacentCells)) {
      this.prepareFight();
      player.fight(this.turnToPlay ? player2 : player1);
    } else {
      this.turnToPlay = !this.turnToPlay;
    }
  }

  /* Cette méthode prépare le DOM visuellement pour le combat */
  prepareFight() {
    $("#board div")
      .not(".hero2, .hero1")
      .css("opacity", "0.5");
    $("[class^='cell'")
      .not(".hero2, .hero1", "obstacle")
      .addClass(`battle`);
    $("#board").off("click");
    $(".cell")
      .addClass("accessible")
      .removeClass("weapon-effect");
    $(".fight-btn").css("visibility", "visible");
  }

  /* Cette méthode décrit le statut des joueurs (vie, armes..) à chaque fin de tour */
  playersDescription(player) {
    $(`#${player.name}-name`)
      .empty()
      .append(`${player.name}`);
    $(`#${player.name}-weapon-image`)
      .empty()
      .append(`<div class='standard-size-img ${player.weapon.name}'></div>`);
    $(`#${player.name}-weapon-name`)
      .empty()
      .append(`${player.weapon.name}`);
    $(`#${player.name}-weapon-infos`)
      .empty()
      .append(`${player.weapon.damage}`);
  }
}
