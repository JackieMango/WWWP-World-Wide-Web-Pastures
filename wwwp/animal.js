export default class Animal extends Phaser.Physics.Arcade.Sprite
{
    animalName = "Unnamed Animal";
    animalStats = {"Speed": 1, "Strength": 1, "Smarts": 1, "Style": 1};
    //This one can wait.
    //animalPersonality = "Calm";
    #animalID = "Error: animalID not set";

    // use optional animalID when getting from database in firestore.js
    constructor(scene, x, y, texture, animalID = 0)
    {
        super(scene,x,y,texture);
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.texture = texture;
        if (animalID === 0 )
            this.#animalID = this.#uuidv4(); // Unique ID for each animal (used for FireStore)
        else
            this.#animalID = animalID;
    }

    addToScene() {
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        //Adding these values to help AnimalList -popup update
        this.x = Phaser.Math.Between(285, 440);
        
        this.y = Phaser.Math.Between(240, 325);
        //testing
        //console.log("x:", this.x, "y:",this.y);
    }

    wander()
    {
        //Only let them move if random number is 1, to prevent them going too fast.
        let rand = Phaser.Math.Between(0, 20);
        if(rand == 1)
        {
            //Pick a new direction for them to wander in.
            let newX = Phaser.Math.Between(-1, 1);
            let newY = Phaser.Math.Between(-1, 1);

            //Check if they are within the bounds of the pen.
            if(this.x + newX > 440 || this.x + newX < 285)
            {
                this.x = this.x - newX;
            }
            else{
                this.x = this.x + newX;
            }
            if(this.y + newY > 325 || this.y + newY < 240)
            {
                this.y = this.y - newY;
            }
            else{
                this.y = this.y + newY;
            }
        }
        
    }

    get name()
    {
        return this.animalName;
    }

    set name(x)
    {
        this.animalName = x;
    }

    get animalID()
    {
        return this.#animalID;
    }

    get stats()
    {
        return this.animalStats;
    }

    //Removing these to help AnimalList -popup update
    //These are making the other variables i added. read-only
    //get xValue() 
   // {
      //  return this.x;
   // }

   // get yValue() 
   // {
      //  return this.y;
   // }

    get animalTexture() {
        return this.texture;
    }

    setStats(stat, value)
    {
        this.animalStats[stat] = value;
    }

    blink()
    {
        this.setTint(0xff0000);
    }

    // Private function to generate a unique animalID (GUID)
    // Credit: Geeks4Geeks (https://www.geeksforgeeks.org/how-to-create-a-guid-uuid-in-javascript/)
    #uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, 
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}