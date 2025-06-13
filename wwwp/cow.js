import Animal from './animal.js';
export default class Cow extends Animal
{
    animalName = "Unnamed Animal";
    //Cows naturally have low speed, higher strength.
    animalStats = {"Speed": 1, "Strength": 10, "Smarts": 5, "Style": 5};

    constructor(scene, x, y, texture, animalID = 0)
    {
        super(scene,x,y,texture,animalID);
        /*
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.x = x;
        this.y = y;
        this.texture = texture;
        this.setCollideWorldBounds(true);
        */
    }

    // Return the number corresponding to the breed
    get breed() {
        return 1;
    }

    sellPrice(){
        let speedDif = Math.floor(Math.max(this.animalStats["Speed"] - 1, 0) * 1.5);
        let strengthDif = Math.floor(Math.max(this.animalStats["Strength"] - 10, 0) * 1.5);
        let smartsDif = Math.floor(Math.max(this.animalStats["Smarts"] - 5, 0) * 1.5);
        let styleDif = Math.floor(Math.max(this.animalStats["Style"] - 5, 0) * 1.5);
        let price = 75 + speedDif + strengthDif + smartsDif + styleDif;
        return price;
    }

    setStats(stat, value)
    {
        //If the value is strength, the cap is 50.
        if(stat == "Strength")
        {
            this.animalStats[stat] = Math.min(value, 50);
        }
        //if the value is "speed," the cap is 20.
        else if(stat == "Speed")
        {
            this.animalStats[stat] = Math.min(value, 20);
        }
        //Else, Cap the value at 40
        else
        {
            this.animalStats[stat] = Math.min(value, 40);
        }
    
    }


}