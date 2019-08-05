import Cell from "./cell.js";

export default class Board {
  constructor(player1, player2, weapons) {
    this.weapons = weapons;
    this.player1 = player1;
    this.player2 = player2;
  }
  /* Méthode de création de la grille de jeux */
  createGrid(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    for (let column = 0; column < width; column++) {
      let columnArr = [];
      for (let row = 0; row < height; row++) {
        let cellDiv = $(
          `<div class='cell' id='cell-c${column}-r${row}' data-x='${column}' data-y='${row}'></div>`
        );
        let cell = new Cell(column, row, cellDiv);
        columnArr.push(cell);
        $("#board").append(cellDiv);
      }
      this.cells.push(columnArr);
    }
    /* Appel de méthodes pour la mise en places des éléments du jeux */
    this.players();
    this.obstacles();
    this.weaponsArr();
  }

  /* Cette méthode pemret de générer un nombre aléatoire entre 0 et le nombre de cases en largeur/hauteur */
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /* Cette méthode renvoie une cellule aléatoire en piochant celle ci dans le tableau cells */
  randomCell() {
    let x = this.randomNumber(0, this.width);
    let y = this.randomNumber(0, this.height);
    let cell = this.cells[x][y];
    return cell;
  }

  players() {
    this.randomPlayers(this.player1);
    this.randomPlayers(this.player2);
  }

  /* Cette méthode place un joueur sur la grille de jeu à la condition que les cases adjacentes et sa potentielle case ne soient pas occupés par l'autre joueur */
  randomPlayers(player) {
    let cell = this.randomCell();
    let adjacentCells = this.getAdjacentCells(cell);
    let adjacentPlayer = adjacentCells.filter(
      adjacentCell => adjacentCell.player !== null
    );
    if (adjacentPlayer.length === 0 && cell.player === null) {
      cell.player = player;
      cell.elmt.addClass(player.name);
      player.currentCell = cell;
    } else {
      this.randomPlayers(player);
    }
  }
  /* Cette méthode calcule le nombre moyen d'obstacles en fonction du nombre de cellule dans la grille de jeu. Elle place ensuite les obstacles dans le DOM et modifie la propriété obstacle des cellules */
  obstacles() {
    let averageObstacles = Math.floor(
      (this.width * this.height) / ((this.width + this.height) / 2)
    );
    for (let obstacles = 0; obstacles < averageObstacles; obstacles++) {
      let cell = this.randomFreeCell();
      cell.obstacle = true;
      cell.elmt.addClass("obstacle");
    }
  }

  /* Cette méthode passe en revue chaque arme du tableau weapons afin de les placer dans le DOM et de modifier les propriétées weapon des cellules les comportants */
  weaponsArr() {
    this.weapons.forEach(weapon => {
      let cell = this.randomFreeCell();
      cell.weapon = weapon;
      cell.elmt.addClass(`${weapon.name} weapon-effect`);
    });
  }

  /* Cette méthode renvoie une cellule libre (sans obstacle, ni arme, ni joueur) */
  randomFreeCell() {
    let cell = this.randomCell();
    if (!cell.obstacle && cell.player === null && cell.weapon === null) {
      return cell;
    } else {
      return this.randomFreeCell();
    }
  }
  /* Cette méthode renvoie toutes les cases adjacentes à une cellule */
  getAdjacentCells(cell) {
    let adjacentCells = [];
    if (cell.x + 1 < this.width) {
      adjacentCells.push(this.cells[cell.x + 1][cell.y]);
    }
    if (cell.x - 1 >= 0) {
      adjacentCells.push(this.cells[cell.x - 1][cell.y]);
    }
    if (cell.y + 1 < this.height) {
      adjacentCells.push(this.cells[cell.x][cell.y + 1]);
    }
    if (cell.y - 1 >= 0) {
      adjacentCells.push(this.cells[cell.x][cell.y - 1]);
    }
    return adjacentCells;
  }

  /* Cette méthode vérifie que la cellule existe */
  cellExist(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }
  /* Cette méthode renvoie un tableau des cases accessibles selon la direction indiquée en paramètre(horizontal/vertival/+1/-1)*/
  getAccessibleCellsInDirection(cell, nbOfAccessCell, horizontal, sign) {
    let accessibleCells = [];
    for (let i = 1; i <= nbOfAccessCell; i++) {
      let x = cell.x + (horizontal ? sign * i : 0);
      let y = cell.y + (horizontal ? 0 : sign * i);
      if (this.cellExist(x, y) && this.cells[x][y].isFree()) {
        accessibleCells.push(this.cells[x][y]);
      } else {
        break;
      }
    }
    return accessibleCells;
  }
  /*La méthode getAccessibleCells de la classe Board est appelé dans l'objet game de la classe Game */
  /* Cette méthode regroupe(concat) les tableaux renvoyés par getAccessibleCellsInDirection afin de renvoyer toutes les cases accessibles par le joueur*/
  getAccessibleCells(cell, nbOfAccessCell) {
    let accessibleCells = [];
    accessibleCells = accessibleCells.concat(
      this.getAccessibleCellsInDirection(cell, nbOfAccessCell, true, 1)
    );
    accessibleCells = accessibleCells.concat(
      this.getAccessibleCellsInDirection(cell, nbOfAccessCell, true, -1)
    );
    accessibleCells = accessibleCells.concat(
      this.getAccessibleCellsInDirection(cell, nbOfAccessCell, false, 1)
    );
    accessibleCells = accessibleCells.concat(
      this.getAccessibleCellsInDirection(cell, nbOfAccessCell, false, -1)
    );

    accessibleCells.forEach(accessiblesCell =>
      accessiblesCell.elmt.addClass("accessible")
    );
  }
}
