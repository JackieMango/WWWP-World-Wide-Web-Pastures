import { saveData } from './firestore.js';

const price = {
    "wheat": {
        name: "Wheat",
        seed: -10, // cost for seeds
        crop: 20 // sell for crops
    },
    "carrot": {
        name: "Carrot",
        seed: -5,
        crop: 10
    },
    "watermelon": {
        name: "Watermelon",
        seed: -15,
        crop: 30
    }
}

const time = 5000;

export function buySeeds(scene) {
    const wheatSeed = document.getElementById("wheat-seed");
    const carrotSeed = document.getElementById("carrot-seed");
    const watermelonSeed = document.getElementById("watermelon-seed");
    const wheatNotif = document.getElementById("wheat-seed-notif");
    const carrotNotif = document.getElementById("carrot-seed-notif");
    const watermelonNotif = document.getElementById("watermelon-seed-notif");
    const error = document.getElementById("purchase-error");
    wheatSeed.onclick = function () {
        //console.log(scene.thisUser);
        if (scene.thisUser.coins >= price["wheat"].seed) {
            scene.thisUser.incrementCoins(price["wheat"].seed);
            scene.thisUser.incrementSeedCnt(1, 5);
            saveData(scene.thisUser);
            wheatNotif.style.display = "block";
            setTimeout(function() {
                wheatNotif.style.display = "none";
            }, time);
            //console.log("Wheat Seeds Purchased");
        }
        else {
            error.style.display = "block";
            setTimeout(function() {
                error.style.display = "none";
            }, time);
            //console.log("Not enough coins");
        }
    }
    carrotSeed.onclick = function() {
        if (scene.thisUser.coins >= price["carrot"].seed) {
            scene.thisUser.incrementCoins(price["carrot"].seed);
            scene.thisUser.incrementSeedCnt(3, 7);
            saveData(scene.thisUser);
            carrotNotif.style.display = "block";
            setTimeout(function() {
                carrotNotif.style.display = "none";
            }, time);
            //console.log("Carrot Seeds Purchased");
        }
        else {
            error.style.display = "block";
            setTimeout(function() {
                error.style.display = "none";
            }, time);
            //console.log("Not enough coins");
        }
    }
    watermelonSeed.onclick = function() {
        if (scene.thisUser.coins >= price["watermelon"].seed) {
            scene.thisUser.incrementCoins(price["watermelon"].seed);
            scene.thisUser.incrementSeedCnt(2, 3);
            saveData(scene.thisUser);
            watermelonNotif.style.display = "block";
            setTimeout(function() {
                watermelonNotif.style.display = "none";
            }, time);
            //console.log("Watermelon Seeds Purchased");
        }
        else {
            error.style.display = "block";
            setTimeout(function() {
                error.style.display = "none";
            }, time);
            //console.log("Not enough coins");
        }
    }
}

export function sellCrops(scene) {
    const wheat = document.getElementById("wheat");
    const carrot = document.getElementById("carrot");
    const watermelon = document.getElementById("watermelon");
    const wheatNotif = document.getElementById("wheat-crop-notif");
    const carrotNotif = document.getElementById("carrot-crop-notif");
    const watermelonNotif = document.getElementById("watermelon-crop-notif");
    const error = document.getElementById("sell-error");
    wheat.onclick = function() {
        if (scene.thisUser.crops.get(1) > 0) {
            scene.thisUser.incrementCoins(price["wheat"].crop);
            scene.thisUser.incrementCropCnt(1, -1);
            saveData(scene.thisUser);
            wheatNotif.style.display = "block";
            setTimeout(function() {
                wheatNotif.style.display = "none";
            }, time);
            //console.log("Wheat Crops Sold");
        }
        else {
            error.style.display = "block";
            setTimeout(function() {
                error.style.display = "none";
            }, time);
            //console.log("No wheat");
        }
    }
    carrot.onclick = function() {
        if (scene.thisUser.crops.get(3) > 0) {
            scene.thisUser.incrementCoins(price["carrot"].crop);
            scene.thisUser.incrementCropCnt(3, -1);
            saveData(scene.thisUser);
            carrotNotif.style.display = "block";
            setTimeout(function() {
                notification.style.display = "none";
                carrotNotif.style.display = "none";
            }, time);
            //console.log("Carrot Crops Sold");
        }
        else {
            error.style.display = "block";
            setTimeout(function() {
                error.style.display = "none";
            }, time);
            //console.log("No carrots");
        }
    }
    watermelon.onclick = function() {
        if (scene.thisUser.crops.get(2) > 0) {
            scene.thisUser.incrementCoins(price["watermelon"].crop);
            scene.thisUser.incrementCropCnt(2, -1);
            saveData(scene.thisUser);
            watermelonNotif.style.display = "block";
            setTimeout(function() {
                watermelonNotif.style.display = "none";
            }, time);
            //console.log("Watermelon Crops Sold");
        }
        else {
            error.style.display = "block";
            setTimeout(function() {
                error.style.display = "none";
            }, time);
            //console.log("No watermelon");
        }
    }
}