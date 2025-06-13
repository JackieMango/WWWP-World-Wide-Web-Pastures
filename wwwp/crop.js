import { saveData } from './firestore.js';
// each crop needs a sprite, growth stages, growth time, and how many yields
// wheat: 3 sprites (1 per stage), 3 growth stages, 5 sec growth time, 3 yield
// carrots: 3 sprites (1 per stage), 3 growth stages, 7 sec growth time, 5 yield
// watermelon: 3 sprites (1 per stage), 3 growth stages, 10 sec growth time, 1 yield

// Crop class
export default class Crop {
    // Constructor
    constructor(scene, cropData, currStage=0) {
        this.scene = scene;
        this.cropType = cropData.name;
        this.layers = cropData.layers;
        this.maxGrowthStage = cropData.growthStages;
        this.growthStage = currStage;
        this.growthTime = cropData.growthTime;
        this.harvestYield = cropData.harvestYield;

        this.updateVisibility();

        if (this.growthStage < this.maxGrowthStage) {
            // Start growing the crop
            this.startGrowing();
        }
    }

    // Function to start the growth process
    startGrowing() {
        this.updateVisibility();
        this.scene.time.delayedCall(this.growthTime, () => {
            this.grow();
            this.save();
        });
    }

    // Function to handle the growth of the crop
    grow() {
        this.growthStage++;
        this.updateVisibility();
        if (this.growthStage < this.maxGrowthStage) {
            this.startGrowing();
        }
    }

    updateVisibility() {
        if(this.growthStage === this.maxGrowthStage) {
            this.layers[5].setVisible(true);
        }
        else {
            for (let i = 0; i < this.layers.length; i++) {
                this.layers[i].setVisible(i === this.growthStage);
            }
        }
    }

    // Function to handle harvesting the crop
    harvest() {
        // Logic for harvesting the crop
        //console.log(`Harvested ${this.harvestYield} ${this.cropType}(s)`);
        this.layers.forEach(layer => layer.setVisible(false));
    }

    save() {
        const time = 5000;
        if (this.cropType === "Wheat") {
            this.scene.thisUser.wheatStage = this.growthStage;
            if (this.growthStage === this.maxGrowthStage) {
                const notif = document.getElementById("wheat-grown");
                if(notif) {
                    notif.style.display = "block";
                    setTimeout(function () {
                        notif.style.display = "none";
                    }, time);
                }
            }
        }
        else if (this.cropType === "Watermelon") {
            this.scene.thisUser.watermelonStage = this.growthStage;
            if (this.growthStage === this.maxGrowthStage) {
                const notif = document.getElementById("watermelon-grown");
                if (notif) {
                    notif.style.display = "block";
                    setTimeout(function () {
                        notif.style.display = "none";
                    }, time);
                }
            }
        }
        else if (this.cropType === "Carrot") {
            this.scene.thisUser.carrotStage = this.growthStage;
            if (this.growthStage === this.maxGrowthStage) {
                const notif = document.getElementById("carrot-grown");
                if (notif) {
                    notif.style.display = "block";
                    setTimeout(function () {
                        notif.style.display = "none";
                    }, time);
                }
            }
        }
        saveData(this.scene.thisUser);
        //console.log(`${this.cropType} data saved! Current stage: ${this.growthStage}`);
    }
}