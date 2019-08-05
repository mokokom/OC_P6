export default class Cell {
  constructor(x, y, elmt) {
    this.x = x;
    this.y = y;
    this.elmt = elmt;
    this.obstacle = false;
    this.player = null;
    this.weapon = null;
  }
  /* On verifie que la case en question n'est pas occupé par un obstacle/joueur*/
  isFree() {
    return this.player == null && !this.obstacle;
  }
}
