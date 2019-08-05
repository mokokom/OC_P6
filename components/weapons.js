export let weapons = [];

class Weapon {
  constructor(name, damage) {
    this.name = name;
    this.damage = damage;
  }
}

let weapon1 = new Weapon("super-pistol", 15);
let weapon2 = new Weapon("mega-blaster", 20);
let weapon3 = new Weapon("magic-sword", 30);
let weapon4 = new Weapon("mega-power", 40);
export let weapon5 = new Weapon("blaster", 10);

weapons.push(weapon1, weapon2, weapon3, weapon4);
