import Animal from "./animal.js";
import Cow from "./cow.js";
import Chicken from "./chicken.js";
import Goat from "./goat.js";

// CURRENTLY NOT IN USE
// Spawns two test animals
// Needs to be changed to spawn all animals in the User object
// (Probably will need to pass in user)
export function spawnAnimals() {
        //console.log("If you are seeing this message, you should not be.")
        //console.log("Spawning animals in the pen...");
        const testAnimal1 = new Animal(this, 350, 300, 'cow');
        testAnimal1.setStats("Speed",5);
        testAnimal1.setStats("Smarts",4);
        testAnimal1.setStats("Style",3);
        testAnimal1.setStats("Strength",2);
    
        const testAnimal2 = new Animal(this, 300, 250, 'cow');
    
        this.animalArray = [testAnimal1, testAnimal2];
    
        // this.breedAnimal(testAnimal1, testAnimal2, animalArray);
        //console.log("Animals spawned:", this.animalArray);
    }

// Takes the current scene, two Animal objects, and the animalArray
// Adds a new Animal into the array and displays the baby to screen
export function breedAnimals(scene, parentA, parentB, array, callback) {
    let baby; 

    if (parentA.breed == 1)
    {
        baby = new Cow(scene, Phaser.Math.Between(285, 440), Phaser.Math.Between(240, 325), 'cow');
    }
    else if (parentA.breed == 2)
    {
        baby = new Chicken(scene, Phaser.Math.Between(285, 440), Phaser.Math.Between(240, 325), 'chicken');
    }
    else if (parentA.breed == 3)
    {
        baby = new Goat(scene, Phaser.Math.Between(285, 440), Phaser.Math.Between(240, 325), 'goat');
    }

    var randNum = Phaser.Math.Between(0, 5);

    if(randNum % 2 == 0)
    {
        var inheritingParent = parentA.stats;
    }
    else
    {
        var inheritingParent = parentB.stats;
    }
    
    //Chance for mutation
    //var mutation = Phaser.Math.floorTo(Phaser.Math.Between(-2, 2)/2) This line was crashing breedAnimal function. When the pop-up was trying to accesss.
    var mutation = Math.floor(Phaser.Math.Between(-2, 2) / 2); 
    

    let bestTraitA = findMax(parentA.stats);
    let bestTraitB = findMax(parentB.stats);
    let worstTraitA = findMin(parentA.stats);
    let worstTraitB = findMin(parentB.stats);

    //Implement a check to see if you should go w/ best trait, worst, or random..

    var i = 0;
    Object.keys(inheritingParent).forEach(function(key) 
    {
        if(i == randNum)
        {
            baby.setStats(key, inheritingParent[key] + mutation);
        }
        else
        {
            baby.setStats(key, inheritingParent[key]);
        }
        i++;
    });
    i = 0;

    if (randNum == 4)
    {
        baby.setStats(bestTraitA, parentA.stats[bestTraitA] + mutation);
        baby.setStats(bestTraitB, parentB.stats[bestTraitB] + mutation);
    }
    else if (randNum == 5)
    {
        baby.setStats(worstTraitA, parentA.stats[worstTraitA] + mutation);
        baby.setStats(worstTraitB, parentB.stats[worstTraitB] + mutation);
    }
    
    Phaser.Utils.Array.Add(array, baby);

    if (callback) {
        callback();
    }
}

// Finds the largest trait from an Animal object
// Takes the Animal object
function findMax(x)
{
    //I know this is really ugly, I will find a better way to handle
    //iterating through a dictionary later.

    let max = x["Speed"];
    let stat = "Speed";

    if(x["Strength"] > max)
    {
        max = x["Strength"];
        stat = "Strength";
    };
    if(x["Smarts"] > max)
    {
        max = x["Smarts"];
        stat = "Smarts";
    };
    if(x["Style"] > max)
    {
        max = x["Style"];
        stat = "Style";
    };
    return stat;
}

// Finds the lowest trait from an Animal object
// Takes the Animal object
function findMin(x)
{
    //I know this is really ugly, I will find a better way to handle
    //iterating through a dictionary later.

    let min = x["Speed"];
    let stat = "Speed";

    if(x["Strength"] < min)
    {
        min = x["Strength"];
        stat = "Strength";
    };
    if(x["Smarts"] < min)
    {
        min = x["Smarts"];
        stat = "Smarts";
    };
    if(x["Style"] < min)
    {
        min = x["Style"];
        stat = "Style";
    };
    return stat;
}