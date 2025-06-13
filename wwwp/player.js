var keys;
//class can be exported to maps
export default class Player
{
    constructor(scene, x, y){
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.Bunny = this.scene.physics.add.sprite(x, y, 'Bunny', 'BunnyWalk/foward0.png');
        // resize collider for bunny
        this.Bunny.body.setSize(this.Bunny.width *.5, this.Bunny.height *1)
        this.cursors = this.scene.input.keyboard.createCursorKeys()
        keys = this.scene.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });
    }



 create() {
    // creates the idle animation from the data
    this.scene.anims.create({
        key:'Bunny-idle-down',
        frames: [{key:'Bunny', frame:'BunnyWalk/foward0.png'}]
    });
    this.scene.anims.create({
        key:'Bunny-idle-up',
        frames: [{key:'Bunny', frame:'BunnyWalk/back0.png'}]
    });
    this.scene.anims.create({
        key:'Bunny-idle-right',
        frames: [{key:'Bunny', frame:'BunnyWalk/right0.png'}]
    }) ;
    this.scene.anims.create({
        key:'Bunny-idle-left',
        frames: [{key:'Bunny', frame:'BunnyWalk/left0.png'}]
    });

    // running animations
    this.scene.anims.create({
        key:'Bunny-run-down',
        frames: this.scene.anims.generateFrameNames('Bunny',{start:0, end:4, prefix:'BunnyWalk/foward', suffix:'.png'}),
        repeat: -1,
        frameRate:15
    });
    this.scene.anims.create({
        key:'Bunny-run-up',
        frames: this.scene.anims.generateFrameNames('Bunny',{start:0, end:4, prefix:'BunnyWalk/back', suffix:'.png'}),
        repeat: -1,
        frameRate:15
    });
    this.scene.anims.create({
        key:'Bunny-run-left',
        frames: this.scene.anims.generateFrameNames('Bunny',{start:0, end:7, prefix:'BunnyWalk/left', suffix:'.png'}),
        repeat: -1,
        frameRate:15
    });
    this.scene.anims.create({
        key:'Bunny-run-right',
        frames: this.scene.anims.generateFrameNames('Bunny',{start:0, end:7, prefix:'BunnyWalk/right', suffix:'.png'}),
        repeat: -1,
        frameRate:15
    });
    this.Bunny.anims.play('Bunny-idle-down')
   
    const input = document.getElementById("name");
    if (input) {
        input.addEventListener('focus', () => {
            this.scene.typing = true;
        });
        input.addEventListener('blur', () => {
            this.scene.typing = false;
        });
        input.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
    }
    const cowInput = document.getElementById("cowName");
    if (cowInput) {
        cowInput.addEventListener('focus', () => {
            this.scene.typing = true;
        });
        cowInput.addEventListener('blur', () => {
            this.scene.typing = false;
        });
        cowInput.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
    }
    const chickenInput = document.getElementById("chickenName");
    if (chickenInput) {
        chickenInput.addEventListener('focus', () => {
            this.scene.typing = true;
        });
        chickenInput.addEventListener('blur', () => {
            this.scene.typing = false;
        });
        chickenInput.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
    }
    const goatInput = document.getElementById("goatName");
    if (goatInput) {
        goatInput.addEventListener('focus', () => {
            this.scene.typing = true;
        });
        goatInput.addEventListener('blur', () => {
            this.scene.typing = false;
        });
        goatInput.addEventListener('keydown', (e) => {
            e.stopPropagation();
        });
    }
}

update() {

    const speed = 100
    if (this.scene.typing) {
        return;
    }
    
    // cursors: arrow keys to move character, keys: wasd movement, plays anim
    if(this.cursors.left.isDown||keys.A.isDown)
    {
        this.Bunny.anims.play('Bunny-run-left',true)
        this.Bunny.setVelocity(-speed, 0)
        this.Bunny.setFlipX(false);
    }
    else if(this.cursors.right.isDown||keys.D.isDown)
    {        
        this.Bunny.anims.play('Bunny-run-right',true)
        this.Bunny.setVelocity(speed,0)
        this.Bunny.setFlipX(false);

    }
    else if(this.cursors.up.isDown||keys.W.isDown){
        this.Bunny.anims.play('Bunny-run-up', true)
        this.Bunny.setVelocity(0,-speed)
    }
    else if(this.cursors.down.isDown||keys.S.isDown){
        this.Bunny.anims.play('Bunny-run-down', true)
        this.Bunny.setVelocity(0,speed)
    }
    else{
        this.Bunny.play('Bunny-idle-down')
        this.Bunny.setVelocity(0)
    } 
  }
}