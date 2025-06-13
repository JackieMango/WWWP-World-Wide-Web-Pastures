import {
    onAuthStateChanged,
    auth, 
    logout
} from './login.js'
import Player from './player.js';
import {
    hidePopup,
    closeFarm,
    collisionCallback
} from './popup.js';

import {
    loadData,
    saveData
} from './firestore.js';
import { replant } from './farm.js';

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
        this.popupVisible = false;
        this.playerNearPen = false;
        this.popupVisible = false;
        this.farmVisible = false;
        this.penCenter = { x: 0, y: 0 };
        this.animalArray = []; // Store all animals in the pen
        this.thisUser = null;
        this.typing = false;
        this.path = window.location.pathname;
        this.animalArrayIndex = 0;
        this.inventoryOpen = false;
    }

    preload() {
        //console.log("Preloading assets...");
        this.load.image('tiles', 'assets/global.png');
        this.load.tilemapTiledJSON('farm', 'assets/farm-map.json');
        this.load.atlas('Bunny', 'assets/texture.png', 'assets/texture.json');
        this.load.spritesheet('cow', 'assets/cowSheet.png', { frameWidth: 28, frameHeight: 28 });
        this.load.spritesheet('chicken', 'assets/chickenSheet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('goat', 'assets/goatSheet.png', { frameWidth: 20, frameHeight: 20 });
    }

    create() {
        //console.log("Creating the game scene...");
        const map = this.make.tilemap({ key: 'farm' });
        const tileset = map.addTilesetImage('sprite_sheet', 'tiles');

        //Create all layers
        const groundLayer = map.createLayer('groundLayer', tileset);
        this.farmLand = map.createLayer('emptyFarm', tileset);
        this.wheat1 = map.createLayer('wheat1', tileset);
        this.wheat2 = map.createLayer('wheat2', tileset);
        this.wheat3 = map.createLayer('wheat3', tileset);
        this.wheat4 = map.createLayer('wheat4', tileset);
        this.wheat5 = map.createLayer('wheat5', tileset);
        this.wheat6 = map.createLayer('wheat6', tileset);
        this.watermelon1 = map.createLayer('watermelon1', tileset);
        this.watermelon2 = map.createLayer('watermelon2', tileset);
        this.watermelon3 = map.createLayer('watermelon3', tileset);
        this.watermelon4 = map.createLayer('watermelon4', tileset);
        this.watermelon5 = map.createLayer('watermelon5', tileset);
        this.watermelon6 = map.createLayer('watermelon6', tileset);
        this.carrot1 = map.createLayer('carrot1', tileset);
        this.carrot2 = map.createLayer('carrot2', tileset);
        this.carrot3 = map.createLayer('carrot3', tileset);
        this.carrot4 = map.createLayer('carrot4', tileset);
        this.carrot5 = map.createLayer('carrot5', tileset);
        this.carrot6 = map.createLayer('carrot6', tileset);
        this.pen = map.createLayer('animalPen', tileset);
        const barn = map.createLayer('barn', tileset);
        const worldLayer = map.createLayer('worldLayer', tileset);
        const topLayer = map.createLayer('topLayer', tileset);

        if (!groundLayer || !this.farmLand || !this.pen || !barn || !worldLayer || !topLayer) {
            console.error("ERROR: One or more layers not found! Check Tiled layer names.");
            return;
        }

        this.wheat1.setVisible(false);
        this.wheat2.setVisible(false);
        this.wheat3.setVisible(false);
        this.wheat4.setVisible(false);
        this.wheat5.setVisible(false);
        this.wheat6.setVisible(false);
        this.watermelon1.setVisible(false);
        this.watermelon2.setVisible(false);
        this.watermelon3.setVisible(false);
        this.watermelon4.setVisible(false);
        this.watermelon5.setVisible(false);
        this.watermelon6.setVisible(false);
        this.carrot1.setVisible(false);
        this.carrot2.setVisible(false);
        this.carrot3.setVisible(false);
        this.carrot4.setVisible(false);
        this.carrot5.setVisible(false);
        this.carrot6.setVisible(false);

        // Detects if a new user is logged in 
        // Initializes thisUser as a User object
        onAuthStateChanged(auth, (userAuth) => {
            if (userAuth) {
                //console.log("User is signed in: ", userAuth); //testing
                loadData(userAuth.uid, this).then((user) => {
                    this.thisUser = user;
                    this.updateUsername(this.thisUser.username);

                    // Add user animals to the screen
                    let i = 0;
                    for(i=0; i < this.thisUser.getCowCnt(); i++) {
                        this.thisUser.getCow(i).addToScene();
                        Phaser.Utils.Array.Add(this.animalArray, this.thisUser.getCow(i));

                    }
                    for(i=0; i < this.thisUser.getChickenCnt(); i++) {
                        this.thisUser.getChicken(i).addToScene();
                        Phaser.Utils.Array.Add(this.animalArray, this.thisUser.getChicken(i));
                    }
                    for(i=0; i < this.thisUser.getGoatCnt(); i++) {
                        this.thisUser.getGoat(i).addToScene();
                        Phaser.Utils.Array.Add(this.animalArray, this.thisUser.getGoat(i));
                    }
                    //console.log(this.animalArray);
                    this.animalArrayIndex = this.animalArray.length;

                    // Show current crops on screen
                    replant(this);
                    
                });
            }
            else {
                // TODO: Redirect to login page
                //console.log("User is not logged in.");
            }
        });

        // Inventory open and close
        const invButton = document.getElementById("inventory");
        invButton.addEventListener("click", () => {
            //console.log("clicked inv");
            this.inventory();
            this.inventoryOpen = !this.inventoryOpen;
        });

        // Logout function
        const logoutButton = document.getElementById("logout-button");
        logoutButton.addEventListener("click", () => {
            logout();
            window.location.href = "login.html"; // Redirect to login page
        });

        this.pen.setCollisionByProperty({ collides: true }); //Force Collision on All Animal Pen Tiles
        this.farmLand.setCollisionByExclusion([-1], true); //Force Collision on All Farm Land Tiles
        //console.log("Collision applied to entire animalPen.");

        //Increasing x more than 340 doesn't let pen to get trigger from top-left side

        this.penCenter = { x: 361, y: 282 }; // tweak these values to match the center of your animalPen
        this.farmCenter = { x: 123, y: 202 };



        const spawn = map.findObject("Objects", obj => obj.name === "Spawn Point");
        if (!spawn) {
            console.error("ERROR: Spawn Point not found in tilemap!");
            return;
        }
        this.player = new Player(this, spawn.x, spawn.y);
        this.player.create();
        worldLayer.setCollisionByProperty({ collides: true });
        barn.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player.Bunny, worldLayer);
        this.physics.add.collider(this.player.Bunny, barn);
        //this.player.setCollideWorldBounds(true);

        //Camera Settings
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player.Bunny, true, 0.1, 0.1);

        this.cursors = this.input.keyboard.createCursorKeys();

        //Add Collision to Pen and Detect Entry
        this.physics.add.collider(this.player.Bunny, this.pen, () => {
            collisionCallback(this.player, this.pen, this);
        });

        // add collision to farm and detect entry
        this.physics.add.collider(this.player.Bunny, this.farmLand, () => {
            collisionCallback(this.player, this.farmLand, this);
        });

        //Transition between home page and townsquare
        // Create the player (adjust spawn coordinates as needed)

        // Get entry/exit zone from Tiled
        const entryExitLayer = map.getObjectLayer('entryExitCollides');

        if (entryExitLayer) {
            this.exitZones = this.add.group();

            entryExitLayer.objects.forEach(obj => {
                const zone = this.add.zone(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );
                this.physics.add.existing(zone, true); // Static body
                zone.setVisible(false); // Keep invisible
                this.exitZones.add(zone);

                this.physics.add.overlap(this.player.Bunny, zone, () => {
                    //console.log("Transitioning to town-square.html");
                    window.location.href = "town-square.html";
                });
            });
        } else {
            console.warn("entryExitCollides object layer not found in home map!");
        }
    }

    update() {
        this.player.update();
        //console.log("Player position:", this.player.Bunny.x, this.player.Bunny.y);
        // If popup is visible but player walks away, auto-hide it
        if (this.popupVisible && !this.isPlayerNearPen()) {
            hidePopup();
            this.popupVisible = false;
        }

        if (!this.isPlayerNearFarm() && this.farmVisible) {
            closeFarm(this);
            this.farmVisible = false;
        }
        //Loop that adds new babies to the screen.
        if (this.animalArrayIndex < this.animalArray.length)
        {
            let i = this.animalArrayIndex;
            for(i; i < this.animalArray.length; i++) {
                this.animalArray[i].addToScene();
            }
            this.animalArrayIndex = this.animalArray.length
        }
        //Loop to make the animals move.
        let loopy = 0;
        for(loopy; loopy < this.animalArray.length; loopy++)
        {
            this.animalArray[loopy].wander();
        }

    }

    isPlayerNearPen() {
        const distance = Phaser.Math.Distance.Between(
            this.player.Bunny.x, this.player.Bunny.y,
            this.penCenter.x, this.penCenter.y
        );
        return distance < 150; //This is the distance at which pop-up dissapears
    }

    // Updates the welcome message in the top left to show the user's username
    updateUsername(name) {
        const welcomeText = document.getElementById("welcome-name");
        welcomeText.innerHTML = "Welcome, " + name;
    }

    inventory() {
        const invDropdown = document.getElementById("inventory-dropdown");

        if (!this.inventoryOpen) {
            invDropdown.style.display = "block";
        }
        else {
            invDropdown.style.display = "none";
        }
    }

    isPlayerNearFarm() {
        const distance = Phaser.Math.Distance.Between(
            this.player.Bunny.x, this.player.Bunny.y,
            this.farmCenter.x, this.farmCenter.y
        );
        return distance < 150; // adjust if needed
    }
}