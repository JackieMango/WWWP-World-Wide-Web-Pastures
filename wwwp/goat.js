import Animal from "./animal.js"
export default class Goat extends Animal
{
    animalName = "Unnamed Animal";
    //Goats naturally have low smarts, higher style.
    animalStats = {"Speed": 5, "Strength": 5, "Smarts": 1, "Style": 10};

    constructor(scene, x, y, texture, animalID=0)
    {
        super(scene,x,y,texture, animalID);
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
        return 3;
    }

    sellPrice(){
        let speedDif = Math.floor(Math.max(this.animalStats["Speed"] - 5, 0) * 1.5);
        let strengthDif = Math.floor(Math.max(this.animalStats["Strength"] - 5, 0) * 1.5);
        let smartsDif = Math.floor(Math.max(this.animalStats["Smarts"] - 1, 0) * 1.5);
        let styleDif = Math.floor(Math.max(this.animalStats["Style"] - 10, 0) * 1.5);
        let price = 60 + speedDif + strengthDif + smartsDif + styleDif;
        return price;
    }
    setStats(stat, value)
    {
        //If the value is style, the cap is 50.
        if(stat == "Style")
        {
            this.animalStats[stat] = Math.min(value, 50);
        }
        //if the value is "Smarts," the cap is 20.
        else if(stat == "Smarts")
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