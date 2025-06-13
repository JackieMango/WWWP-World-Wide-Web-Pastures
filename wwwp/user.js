export default class User 
{
    // Private variables
    #uid;
    #username = "New User";
    #coins = 0; // coin count
    #wheatStage = 0; // the stage of growth of the wheat on the farmland (determines asset shown)
    #watermelonStage = 0; // same as above for watermelon plot
    #carrotStage = 0; // same as above for carrot plot
    #cows = [];
    #chickens = [];
    #goats = [];
    crops = new Map([[1, 0], [2, 0], [3, 0]]); // [cropNum, count] 1 - wheat, 2 - watermelons, 3 - carrots
    seeds = new Map([[1, 5], [2, 0], [3, 0]]); // [cropNum, count]

    constructor(uid) {
        this.#uid = uid;
    }
    
    // Setters

    // Change username
    set username(newName) {
        this.#username = newName;
    }

    set coins(coins) {
        this.#coins = coins;
        // Update upper left coin text
        const coinDiv = document.getElementById("coins");
        if(coinDiv) {
            coinDiv.innerText = "Coins: " + coins;
        }
    }

    set wheatStage(num) {
        this.#wheatStage = num;
    }

    set watermelonStage(num) {
        this.#watermelonStage = num;
    }

    set carrotStage(num) {
        this.#carrotStage = num;
    }

    getAllCows()
    {
        return this.#cows;
    }
     getAllGoats()
    {
        return this.#goats;
    }
     getAllChickens()
    {
        return this.#chickens;
    }

    // Increases coin count by input
    // Can take a negative number for decrease
    // Updates the coin display in upper left
    incrementCoins(incCnt) {
        this.#coins += incCnt;
        const coinDiv = document.getElementById("coins");
        if(coinDiv) {
            coinDiv.innerText = "Coins: " + this.#coins;
        }
    }

    // TODO: Functions to increment the current growth stage of each crop on the farmland
    // Returns to zero (not planted) if at five

    // Add new Cow object to the array
    addCow(cow) {
        //console.log("add cow");
        this.#cows.push(cow);
    }

     // Add new Chicken object to the array
    addChicken(chicken) {
        //console.log("add chicken");
        this.#chickens.push(chicken);
    }

     // Add new Goat object to the array
    addGoat(goat) {
        //console.log("add goat");
        this.#goats.push(goat);
    }
      
    // Add new crop with ID number and count
    // Updates inventory display
    addCrop(cropType, count) {
        this.crops.set(cropType, count);
        this.#updateCropInventory(cropType, count);
    }

    // Increase count of existing crop
    // Takes crop num and number to add
    // Can accept negative nums to decrease
    // Updates inventory div with crop count
    // Returns true if successful or false if invalid cropNum or sum less than zero
    incrementCropCnt(cropType, increase) {
        let curCnt = this.crops.get(cropType);
        if(curCnt !== null) {
            let updatedCnt = curCnt + increase;
            if (updatedCnt >= 0) {
                this.crops.set(cropType, updatedCnt);
                this.#updateCropInventory(cropType, updatedCnt);
                return true;
            }
        }
        return false;
    }

    // Add new seeds with ID number and count
    // Updates inventory display
    addSeeds(seedType, count) {
        this.seeds.set(seedType, count);
        this.#updateSeedInventory(seedType, count);
    }

    // Increase count of existing crop
    // Takes seed num and number to add
    // Can accept negative nums to decrease
    // Updates inventory display
    // Returns true if successful or false if invalid cropNum or sum less than zero
    incrementSeedCnt(cropType, increase) {
        let curCnt = this.seeds.get(cropType);
        if(curCnt !== null) {
            let updatedCnt = curCnt + increase;
            if (updatedCnt >= 0) {
                this.seeds.set(cropType, updatedCnt);
                this.#updateSeedInventory(cropType, updatedCnt);
                return true;
            }
        }
        return false;
    }

    removeCow(id)
    {
        const index = this.#cows.findIndex(cow => cow.animalID === id);
        if(index !== -1)
        {
            this.#cows.splice(index, 1);
            return true;
        }
        return false;
    }
    removeGoat(id)
    {
        const index = this.#goats.findIndex(goat => goat.animalID === id);
        if(index !== -1)
        {
            this.#goats.splice(index, 1);
            return true;
        }
        return false;
    }
    removeChicken(id)
    {
        const index = this.#chickens.findIndex(chicken => chicken.animalID === id);
        if(index !== -1)
        {
            this.#chickens.splice(index, 1);
            return true;
        }
        return false;
    } 
    // Getters
    get uid() {
        return this.#uid;
    }

    get username() {
        return this.#username;
    }

    get coins() {
        return this.#coins;
    }

    get wheatStage() {
        return this.#wheatStage;
    }

    get watermelonStage() {
        return this.#watermelonStage;
    }

    get carrotStage() {
        return this.#carrotStage;
    }

    getCow(index) {
        return this.#cows[index];
    }

    getChicken(index) {
        return this.#chickens[index];
    }

    getGoat(index) {
        return this.#goats[index];
    }

    getCowCnt() {
        return this.#cows.length;
    }

    getChickenCnt() {
        return this.#chickens.length;
    }

    getGoatCnt() {
        return this.#goats.length;
    }

    // Updates inventory display with crop count
    #updateCropInventory(cropType, count) {
        const cropInvCnt = document.getElementById(`inv-${cropType}`);
        if (cropInvCnt) {
            //console.log(`inv-${cropType}`);
            cropInvCnt.textContent = count;
        }
    }

    // Updates inventory display with seed count
    #updateSeedInventory(cropType, count) {
        const cropInvCnt = document.getElementById(`inv-s-${cropType}`);
        if (cropInvCnt) {
            //console.log(`inv-s-${cropType}`);
            cropInvCnt.innerText = count;
        }
    }
}