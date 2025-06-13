// importing player to townscene
import Player from './player.js';
import Animal from './animal.js';
import { openAnimalMarketPopup, closeAnimalMarket, collisionCallback, openCropMarketPopup, closeCropMarket } from './popup.js';
import { openCompetitionPopup, closeCompetitionPopup } from './competition-popup.js';
import { onAuthStateChanged, auth } from './login.js';
import { loadData, saveData } from './firestore.js';

class TownScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TownScene' });
    this.animalMarketVisible = false;
    this.cropMarketVisible = false;
    this.competitionPopupOpened = false;
    this.popupVisible = false;
    this.farmVisible = false;
    this.thisUser = null;
    this.animalArray = []; // initialize animalArray
    this.typing = false;
  }

  preload() {
    this.load.image('tiles', 'assets/global.png');
    this.load.tilemapTiledJSON('town-square', 'assets/townsquare-map.json');
    this.load.atlas('Bunny', 'assets/texture.png', 'assets/texture.json');
  }

  create() {
    const map = this.make.tilemap({ key: 'town-square' });
    const tileset = map.addTilesetImage('sprite-sheet2', 'tiles');

    const groundLayer = map.createLayer('groundLayer', tileset);
    const grass = map.createLayer('grass', tileset);
    const border = map.createLayer('border', tileset);
    const worldLayer = map.createLayer('worldLayer', tileset);
    const cropMarket = map.createLayer('cropMarket', tileset);
    const animalMarketLayer = map.createLayer('animalMarket', tileset);
    const competitionStage = map.createLayer('competitionStage', tileset);
    const decoration = map.createLayer('decoration', tileset);
    const customSign = map.createLayer('customSign', tileset);

    const spawn = map.findObject("Spawn", obj => obj.name === "spawnPoint");
    this.player = new Player(this, spawn.x, spawn.y);
    this.player.create();

    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        //console.log("town User is signed in: ", userAuth); //testing
        loadData(userAuth.uid, this).then((user) => {
          this.thisUser = user;

          // VERY IMPORTANT: Sync animalArray to the user's animals
          this.animalArray = this.thisUser.animals;
        });
      } else {
        //console.log("User is not logged in.");
      }
    });

    worldLayer.setCollisionByProperty({ collides: true });
    border.setCollisionByProperty({ collides: true });
    cropMarket.setCollisionByProperty({ collides: true });
    animalMarketLayer.setCollisionByProperty({ collides: true });
    competitionStage.setCollisionByProperty({ collides: true });

    // Add colliders
    this.physics.add.collider(this.player.Bunny, worldLayer);
    this.physics.add.collider(this.player.Bunny, border);

    this.animalMarketCenter = { x: 130.75, y: 60.65 };
    this.cropMarketCenter = { x: 374.09, y: 55.65 };
    this.competitionStageCenter = { x: 261, y: 272 };

    this.animalMarketLayer = animalMarketLayer;
    this.cropMarketLayer = cropMarket;
    this.competitionStageLayer = competitionStage;

    // Animal Market collision
    this.physics.add.collider(this.player.Bunny, animalMarketLayer, () => {
      collisionCallback(this.player, animalMarketLayer, this);
    });

    // Crop Market collision
    this.physics.add.collider(this.player.Bunny, cropMarket, () => {
      collisionCallback(this.player, cropMarket, this);
    });

    // Competition Stage collision
    this.physics.add.collider(this.player.Bunny, competitionStage, () => {
      //console.log("Player collided with competition stage.");
      if (!this.competitionPopupOpened) {
        openCompetitionPopup(this);
      }
    });

    // Entry/Exit zones
    const entryLayer = map.getObjectLayer('entryExitCollides');
    if (entryLayer) {
      this.entryZone = this.add.group();
      entryLayer.objects.forEach((obj) => {
        const zone = this.add.zone(obj.x + obj.width / 2, obj.y + obj.height / 2, obj.width, obj.height);
        this.physics.add.existing(zone, true);
        zone.setVisible(false);
        this.entryZone.add(zone);
        this.physics.add.overlap(this.player.Bunny, zone, () => {
          window.location.href = "home.html";
        });
      });
    } else {
      console.warn("entryExitCollides object layer not found in map!");
    }
  }

  update() {
    this.player.update();

    if (!this.isPlayerNearAnimalMarket() && this.animalMarketVisible) {
      closeAnimalMarket(this);
      this.animalMarketVisible = false;
    }

    if (!this.isPlayerNearCropMarket() && this.cropMarketVisible) {
      closeCropMarket(this);
      this.cropMarketVisible = false;
    }

    if (!this.isPlayerNearCompetitionStage() && this.competitionPopupOpened) {
      closeCompetitionPopup(this);
    }
  }

  isPlayerNearAnimalMarket() {
    const distance = Phaser.Math.Distance.Between(this.player.Bunny.x, this.player.Bunny.y, this.animalMarketCenter.x, this.animalMarketCenter.y);
    return distance < 100;
  }

  isPlayerNearCropMarket() {
    const distance = Phaser.Math.Distance.Between(this.player.Bunny.x, this.player.Bunny.y, this.cropMarketCenter.x, this.cropMarketCenter.y);
    return distance < 100;
  }

  isPlayerNearCompetitionStage() {
    const distance = Phaser.Math.Distance.Between(this.player.Bunny.x, this.player.Bunny.y, this.competitionStageCenter.x, this.competitionStageCenter.y);
    return distance < 100;
  }
}

export default TownScene;