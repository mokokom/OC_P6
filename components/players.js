import { weapon5 } from "./weapons.js";

export default class Player {
  constructor(name) {
    this.name = name;
    this.weapon = weapon5;
    this.life = 100;
    this.currentCell;
    this.defense = false;
  }

  /* Cette méthode change la propriété player de l'ancienne et de la nouvelle case et modifie aussi le DOM pour la partie visuelle */
  move(newCell) {
    this.currentCell.player = null;
    if (this.currentCell.weapon !== null) {
      this.currentCell.elmt.addClass("weapon-effect");
    }
    newCell.player = this;
    this.currentCell = newCell;
    $(".cell").removeClass("accessible");
    $(`.${this.name}`).removeClass(this.name);
    $(newCell.elmt).addClass(this.name);
  }

  /* Cette méthode interverti l'arme d'une case avec celle du joueur. Les propriétés weapon de la case et du joueur sont ainsi modifié ainsi que le DOM */
  changeWeapon(player) {
    let playerWeapon = player.weapon;
    if (this.currentCell.weapon !== null) {
      this.currentCell.elmt
        .removeClass(this.currentCell.weapon.name)
        .removeClass("weapon-effect");
      this.currentCell.elmt.addClass(playerWeapon.name);
      player.weapon = this.currentCell.weapon;
      this.currentCell.weapon = playerWeapon;
    }
  }

  isPlayerAround(cellsAround) {
    for (let cell of cellsAround) {
      if (cell.player !== null) {
        return true;
      }
    }
    return false;
  }

  /* Cette méthode gère le combat en fonction du choix du joueur d'attaquer ou de défendre. Aucun joueur ne peut s'échapper, ainsi la fonction se rappelle elle même en inversant attaquant et cible et ceux jusqu'à ce que la vie d'un des joueurs soit infèrieur ou égale à 0*/
  fight(target) {
    this.defense = false;
    $(`.belt-${this.name}`).css("visibility", "hidden");
    $(`.${target.name}`).css("opacity", "0.5");
    $(`.${target.name}-attack-button`)
      .off("click")
      .css({
        visibility: "hidden",
        "box-shadow": "none",
        animation: "none"
      });
    $(`.${this.name}`).css("opacity", "1");
    $(`.${this.name}-attack-button`)
      .css({
        visibility: "visible",
        "box-shadow": "0px 5px 5px #764462",
        color: "#2c2137",
        "background-color": "#edb4a1",
        animation: "bounceIn 2s 1"
      })
      .on("click", e => {
        let lifeRemaining = (target.life -= target.defense
          ? this.weapon.damage / 2
          : this.weapon.damage);
        $(`.${target.name}-barre-life`).css("width", `${lifeRemaining}%`);
        $(`.${target.name}-percentage-life`).text(`${target.life}%`);
        if (target.life <= 0) {
          $(`.${target.name}`).css("visibility", "hidden");
          $("#endGameModal").modal({
            backdrop: "static",
            keyboard: false
          });
          $(".modal-body").text(
            `${this.name} and his ${
              this.weapon.name
            } weapon win the battle of heroes!`
          );
          $(".modal-body").prepend(
            `<div class='${this.name} standard-size-img'></div>`
          );
          $(".modal-body").append(
            `<div class='battle standard-size-img'></div>`
          );
          $(".reload, .close").click(function() {
            location.reload();
          });
        }
        target.fight(this);
      });

    $(`.${target.name}-defense-button`)
      .off("click")
      .css({
        visibility: "hidden",
        "box-shadow": "none",
        animation: "none"
      });
    $(`.${this.name}-defense-button`)
      .css({
        "box-shadow": "0px 5px 5px #764462",
        color: "#2c2137",
        "background-color": "#edb4a1",
        animation: "bounceIn 2s 1"
      })

      .css("visibility", "visible")
      .on("click", e => {
        this.defense = true;
        $(`.belt-${this.name}`).css("visibility", "visible");
        target.fight(this);
      });
  }
}

export let player1 = new Player("hero1");
export let player2 = new Player("hero2");
