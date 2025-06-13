import Crop from './crop.js';
import { saveData } from './firestore.js';

const cropCount = [];
const time = 5000;

function defCrops(scene) {
    const crops = {
        "wheat": {
            name: "Wheat",
            layers: [
                scene.wheat1,
                scene.wheat2,
                scene.wheat3,
                scene.wheat4,
                scene.wheat5,
                scene.wheat6
            ],
            growthStages: 6,
            growthTime: 5000, // in milliseconds
            harvestYield: 3
        },
        "carrot": {
            name: "Carrot",
            layers: [
                scene.carrot1,
                scene.carrot2,
                scene.carrot3,
                scene.carrot4,
                scene.carrot5,
                scene.carrot6
            ],
            growthStages: 6,
            growthTime: 7000, // in milliseconds
            harvestYield: 5
        },
        "watermelon": {
            name: "Watermelon",
            layers: [
                scene.watermelon1,
                scene.watermelon2,
                scene.watermelon3,
                scene.watermelon4,
                scene.watermelon5,
                scene.watermelon6
            ],
            growthStages: 6,
            growthTime: 10000, // in milliseconds
            harvestYield: 1
        }
    };
    return crops;
}

// Function to handle the planting of seeds
export function plantSeeds(scene) {
    // hide other buttons for plant seeds and harvest crops
    // show options, wheat carrots watermelon back
    // when user chooses an option, plant the seeds and update the UI
    // update seed count
    // if back button is clicked, go back to the original popup
    const farmOptions = document.getElementById("farm-options");
    const seedOptions = document.getElementById("seed-options");
    const wheatBtn = document.getElementById("wheat-seeds");
    const carrotBtn = document.getElementById("carrot-seeds");
    const watermelonBtn = document.getElementById("watermelon-seeds");
    const backBtn = document.getElementById("back1");
    const wheatNotif = document.getElementById("wheat-planted");
    const carrotNotif = document.getElementById("carrots-planted");
    const watermelonNotif = document.getElementById("watermelon-planted");
    const error1 = document.getElementById("seed-error1");
    const error2 = document.getElementById("seed-error2");
    wheatBtn.onclick = function () {
        const crops = defCrops(scene);
        for (let i = 0; i < cropCount.length; i++) {
            if (cropCount[i].cropType === "Wheat") {
                error2.style.display = "block";
                setTimeout(function() {
                    error2.style.display = "none";
                }, time);
                //console.log("Wheat seeds already planted");
                return;
            }
        }
        if (!scene.thisUser.incrementSeedCnt(1, -1)) {
            error1.style.display = "block";
            setTimeout(function() {
                error1.style.display = "none";
            }, time);
            //console.log("No wheat seeds");
            return;
        }
        // plant wheat seeds and update UI
        const wheat = new Crop(scene, crops["wheat"]);
        cropCount.push(wheat);
        wheatNotif.style.display = "block";
        setTimeout(function () {
            wheatNotif.style.display = "none";
        }, time);
        //console.log("Wheat seeds planted");
    }
    carrotBtn.onclick = function () {
        const crops = defCrops(scene);
        for (let i = 0; i < cropCount.length; i++) {
            if (cropCount[i].cropType === "Carrot") {
                error2.style.display = "block";
                setTimeout(function() {
                    error2.style.display = "none";
                }, time);
                //console.log("Carrot seeds already planted");
                return;
            }
        }
        if (!scene.thisUser.incrementSeedCnt(3, -1)) {
            error1.style.display = "block";
            setTimeout(function() {
                error1.style.display = "none";
            }, time);
            //console.log("No carrot seeds");
            return;
        }
        // plant carrot seeds and update UI
        const carrot = new Crop(scene, crops["carrot"]);
        cropCount.push(carrot);
        carrotNotif.style.display = "block";
        setTimeout(function () {
            carrotNotif.style.display = "none";
        }, time);
        //console.log("Carrot seeds planted");
    }
    watermelonBtn.onclick = function () {
        const crops = defCrops(scene);
        for (let i = 0; i < cropCount.length; i++) {
            if (cropCount[i].cropType === "Watermelon") {
                error2.style.display = "block";
                setTimeout(function() {
                    error2.style.display = "none";
                }, time);
                //console.log("Watermelon seeds already planted");
                return;
            }
        }
        if (!scene.thisUser.incrementSeedCnt(2, -1)) {
            error1.style.display = "block";
            setTimeout(function() {
                error1.style.display = "none";
            }, time);
            //console.log("No watermelon seeds");
            return;
        }
        // plant watermelon seeds and update UI
        const watermelon = new Crop(scene, crops["watermelon"]);
        cropCount.push(watermelon);
        watermelonNotif.style.display = "block";
        setTimeout(function () {
            watermelonNotif.style.display = "none";
        }, time);
        //console.log("Watermelon seeds planted");
    }
    backBtn.onclick = function () {
        // go back to the original modal
        seedOptions.style.display = "none";
        farmOptions.style.display = "block";
        //console.log("back");
    }
}

// Function to handle the harvesting of crops
export function harvestCrops(scene) {
    // hide other buttons for plant seeds and harvest crops
    // show options, wheat carrots watermelon back
    // when user chooses an option, harvest the crops and update the UI
    // update crop count
    // if back button is clicked, go back to the original popup
    const farmOptions = document.getElementById("farm-options");
    const croptions = document.getElementById("crops");
    const wheatBtn = document.getElementById("wheat-crop");
    const carrotBtn = document.getElementById("carrot-crop");
    const watermelonBtn = document.getElementById("watermelon-crop");
    const backBtn = document.getElementById("back2");
    const wheatNotif = document.getElementById("wheat-harvest");
    const carrotNotif = document.getElementById("carrot-harvest");
    const watermelonNotif = document.getElementById("watermelon-harvest");
    const error = document.getElementById("harvest-error");
    wheatBtn.onclick = function () {
        // harvest wheat crops and update UI
        for (let i = 0; i < cropCount.length; i++) {
            if (cropCount[i].cropType === "Wheat" && cropCount[i].growthStage === cropCount[i].maxGrowthStage) {
                //console.log("Wheat button clicked");
                cropCount[i].harvest();
                scene.thisUser.incrementCropCnt(1, cropCount[i].harvestYield);
                cropCount.splice(i, 1);
                scene.thisUser.wheatStage = 0;
                saveData(scene.thisUser);
                //console.log(scene.thisUser.wheatStage);
                wheatNotif.style.display = "block";
                setTimeout(function () {
                    wheatNotif.style.display = "none";
                }, time);
                //console.log("Wheat crops harvested");
                break;
            }
            else {
                error.style.display = "block";
                setTimeout(function () {
                    error.style.display = "none";
                }, time)
                break;
            }
        }
    }
    carrotBtn.onclick = function () {
        // harvest carrot crops and update UI
        for (let i = 0; i < cropCount.length; i++) {
            if (cropCount[i].cropType === "Carrot" && cropCount[i].growthStage === cropCount[i].maxGrowthStage) {
                //console.log("Carrot button clicked");
                cropCount[i].harvest();
                scene.thisUser.incrementCropCnt(3, cropCount[i].harvestYield);
                cropCount.splice(i, 1);
                scene.thisUser.carrotStage = 0;
                saveData(scene.thisUser);
                carrotNotif.style.display = "block";
                setTimeout(function () {
                    carrotNotif.style.display = "none";
                }, time);
                //console.log("Carrot crops harvested");
                break;
            }
            else {
                error.style.display = "block";
                setTimeout(function () {
                    error.style.display = "none";
                }, time)
                break;
            }
        }
    }
    watermelonBtn.onclick = function () {
        // harvest watermelon crops and update UI
        for (let i = 0; i < cropCount.length; i++) {
            //console.log(scene.thisUser.watermelonStage);
            if (cropCount[i].cropType === "Watermelon" && cropCount[i].growthStage === cropCount[i].maxGrowthStage) {
                //console.log("Watermelon button clicked");
                cropCount[i].harvest();
                scene.thisUser.incrementCropCnt(2, cropCount[i].harvestYield);
                cropCount.splice(i, 1);
                scene.thisUser.watermelonStage = 0;
                saveData(scene.thisUser);
                watermelonNotif.style.display = "block";
                setTimeout(function () {
                    watermelonNotif.style.display = "none";
                }, time);
                //console.log("Watermelon crops harvested");
                break;
            }
            else {
                error.style.display = "block";
                setTimeout(function () {
                    error.style.display = "none";
                }, time)
                break;
            }
        }
    }
    backBtn.onclick = function () {
        // go back to the original popup
        croptions.style.display = "none";
        farmOptions.style.display = "block";
    }
}

export function replant(scene) {
    const crops = defCrops(scene);
    if (scene.thisUser.wheatStage > 0) {
        const wheat = new Crop(scene, crops["wheat"], scene.thisUser.wheatStage);
        cropCount.push(wheat);
       //console.log("Wheat seeds replanted");
    }
    if (scene.thisUser.carrotStage > 0) {
        const carrot = new Crop(scene, crops["carrot"], scene.thisUser.carrotStage);
        cropCount.push(carrot);
        //console.log("Carrot seeds replanted");
    }
    if (scene.thisUser.watermelonStage > 0) {
        const watermelon = new Crop(scene, crops["watermelon"], scene.thisUser.watermelonStage);
        cropCount.push(watermelon);
        //console.log("Watermelon seeds replanted");
    }
}