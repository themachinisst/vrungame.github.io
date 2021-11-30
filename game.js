import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
  //var kaboom = require('kaboom')
 // initialize kaboom context

kaboom({
    width: 600,
    height: 1200,
    background: [ 0, 0, 0, ],
    canvas: document.querySelector("#mycanvas"),   
    
});

var IOS = false;
if(/iPhone|iPad|iPod|Opera Mini/i.test(navigator.userAgent) ) {
    // run your code here
    IOS = true
   }


// The 2D Context for the HTML canvas element. It
// provides objects, methods, and properties to draw and
// manipulate graphics on a canvas drawing surface.


let SPEED = 500;    
let score = 0; 
let fuel = 11;
let right = true;

//loadFont("MCF", "/fonts/MCFont_10x8.png", 10, 8);
loadSprite("track1", "assets/track1.jpg");
loadSprite("track2", "assets/track2.jpg");
loadSprite("track3", "assets/track3.jpg");
loadSprite("track4", "assets/track4.jpg");
loadSprite("track5", "assets/track5.jpg");
loadSprite("track6", "assets/track6.jpg");
loadSprite("track7", "assets/track7.jpg");
loadSprite("train", "assets/TrainSprite.png", {
    sliceX: 21,
    sliceY: 1,
    anims:{
        "Left":{
            from: 11,
            to:20,
            speed:35,
        },
        "Right":{
            from:0,
            to:11,
            speed:35,
        }
    }
});

loadSprite("smokeAnim", "assets/smokeAnim2.png", {    
    sliceX: 14,
    sliceY: 1,
    anims:{
        "boom":{
            from: 0,
            to:13,
            speed: 15,
        }
    }
});


loadSprite("TrainObsLeft", "assets/trainCabLeft.png");
loadSprite("TrainObsRight", "assets/trainCabRight.png");
loadSprite("MuteBut", "assets/mutebutton.png");

//For main menu
loadSprite("Main", "assets/Main.jpg");

// For end page 
loadSprite("EndPage", "assets/endPage.jpg");


loadSprite("BoundBox", "assets/boundingbox.png");

//audio
loadSound("MCReg", "./assets/audio/MCReg.mp3");
loadSound("crash", "./assets/audio/crash.mp3");

var Mute = false; 
scene("game", () => {
    
    fullscreen(true);
    layers([
        "bot",
        "mid",
        "top"
    ], "top");
    
    //for background track
    let Track = choose(["track1", "track2", "track3"]);
    let Track2 = choose([ "track4", "track5", "track6", "track7"]);

   onUpdate(()=>{
        if(TrackbgOne.pos.y>=6000)
            {
                //alert("negative position of train")
                TrackbgOne.moveTo(0,0);
                TrackbgTwo.moveTo(0,-2400);
                TrackbgThree.moveTo(0,-3600);
                TrackbgFour.moveTo(0,-4800);
                TrackbgFive.moveTo(0,-6000);
                Track = choose(["track1", "track2", "track3"]);
                Track2 = choose([ "track4", "track5", "track6", "track7"]);
   
                //debug.log(Track)
            }
    })

    let TrackbgOne = add([
        //sprite(choose(["track1", "track2", "track3", "track4", "track5", "track6", "track7"])),
        sprite(Track),
        origin("topleft"),
        pos(0, 0),
        scale(1),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgOne"
    ]);

    let TrackbgTwo = add([
        //sprite(choose(["track1", "track2", "track3", "track4", "track5", "track6", "track7"])),
        sprite(Track2),
        origin("topleft"),
        pos(0, -2400),
        scale(1),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgTwo"
    ]);
      
    let TrackbgThree = add([
        //sprite(choose(["track1", "track2", "track3", "track4", "track5", "track6", "track7"])),
        sprite(Track),
        origin("topleft"),
        pos(0, -3600),
        scale(1),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgTwo"
    ]);

    let TrackbgFour = add([
        //sprite(choose(["track1", "track2", "track3", "track4", "track5", "track6", "track7"])),
        sprite(Track2),
        origin("topleft"),
        pos(0, -4800),
        scale(1),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgTwo"
    ]);

    let TrackbgFive = add([
        //sprite(choose(["track1", "track2", "track3", "track4", "track5", "track6", "track7"])),
        sprite(Track),
        origin("topleft"),
        pos(0, -6000),
        scale(1),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgTwo"
    ]);


    //for platform
    add([
        rect(width(), 0),
        pos(0, height()),
        outline(4),
        origin("botleft"),
        area(),
        layer("bot"),
        solid(),
        color(127, 200, 255),
    ]);

    //add train

    const Train = add([
        sprite("train"),
        origin("botleft"),
        pos(100, height()),
        scale(1),
        area(),
        //body(),
        layer("top"),
    ]);
//For spawning boosters
    function spawnObstacleLeft(){
        //add coins 
        let TrainObsLeft = add([
            sprite("TrainObsLeft"),
            pos(80, -rand(1000, 2000)),
            area(),
            origin("botleft"),
            layer("mid"),
            scale(1.6),
            move(DOWN, SPEED),
            "TrainObs", // add a tag here
        ]);

        Train.collides("TrainObsLeft", () => {
            //Train.destroy();
            var smokeposx = TrainObsLeft.pos.x
            var smokeposy = TrainObsLeft.pos.y
            let smokeAnim = add([
                sprite("smokeAnim",{
                    anims: "boom",
                }),
                pos(smokeposx-400, smokeposy-600),
                area(),
                origin("topleft"),
                layer("mid"),
                scale(3),
                move(DOWN, SPEED),
                "smokeAnim", // add a tag here
            ]);
            smokeAnim.play("boom");
            if(!IOS)
                navigator.vibrate(200)
            play("crash", {
                volume: 0.8
            });
            //loseWindow();
        });

    // wait a random amount of time to spawn next boost
    wait(rand(10, 15), (spawnObstacleLeft));
}

//start spawning obstacles
spawnObstacleLeft();



    function spawnObstacleRight(){
        //add coins 
    
        let TrainObsRight = add([
            sprite("TrainObsRight"),
            pos(360, -rand(4000, 5000)),
            area(),
            origin("botleft"),
            layer("mid"),
            scale(1.6),
            move(DOWN, SPEED),
            "TrainObs", // add a tag here
        ]);

       Train.collides("TrainObsRight", () => {
            //Train.destroy();
            var smokeposx = TrainObsRight.pos.x
            var smokeposy = TrainObsRight.pos.y
            let smokeAnim = add([
                sprite("smokeAnim",{
                    anims: "boom",
                }),
                pos(smokeposx-400, smokeposy-600),
                area(),
                origin("topleft"),
                layer("mid"),
                scale(3),
                move(DOWN, SPEED),
                "smokeAnim", // add a tag here
            ]);
            smokeAnim.play("boom");
            if(!IOS)
                navigator.vibrate(200)
            play("crash", {
                volume: 0.8
            });
            //loseWindow();
        });
    // wait a random amount of time to spawn next boost
    wait(rand(8, 12), (spawnObstacleRight));
    }

    //start spawning obstacles
    spawnObstacleRight();

   
    function moveToRight(){
        Train.onUpdate(() => {
            Train.move(SPEED, 0)
            if(Train.pos.x >= 350){
                Train.pos.x = 350
            }
        })
    }

    function moveToLeft(){
        Train.onUpdate(() => {
            Train.move(-SPEED, 0)
            if(Train.pos.x <= 100){
                Train.pos.x = 100
            }
            //debug.log(Train.pos.x)
        })
    }

    function changeTrack(){
            if(!right){
                Train.play("Left");
                moveToLeft()
                right = true;
            }else{
                Train.play("Right");
                moveToRight()
                right = false;
            };
    };

    mouseClick(changeTrack);
   

    //add scores
    add([
        text("score:"),
        pos(250, 24),
        scale(0.4),
        layer("top"),
    ])
    const scoreLabel = add([
        text(score),
        pos(380, 24),
        scale(0.4),
        layer("top"),
    ])
    
    //add fuel label
    add([
        text("fuel: "),
        pos(250, 50),
        scale(0.4),
        layer("top"),
    ])
    const fuelLabel = add([
        text(fuel),
        pos(350, 50),
        scale(0.4),
        layer("top"),
    ])
    
    action(()=>{
        score+=0.2;
        scoreLabel.text = Math.floor(score);

        if(score>50){
            //go("lose", (scoreLabel.text));
        }
    })
});


scene("lose", (score) => {

    add([
        sprite("EndPage"),
        origin("topleft"),
        pos(0, 0),
        scale(1),
        area(),
        //body(),
        layer("top"),
    ]);

     //add scores
     add([
        text("score:"),
        pos(250, 24),
        scale(0.4),
        layer("top"),
    ])

    let scoreLabel = add([
        text(score),
        pos(380, 24),
        scale(0.4),
        layer("top"),
    ])

    let TryButCont = add([
        sprite("BoundBox"),
        origin("topleft"),
        pos(width()/12, height()/12),
        scale(6),
        area(),
        //body(),
        layer("top"),
        "TryButCont"
    ]);

    onClick("TryButCont", ()=>{
        go("game", score=0);
    })
})


scene("main", () => {

    add([
        sprite("Main"),
        origin("topleft"),
        pos(0, 0),
        scale(1),
        area(),
        //body(),
        layer("top"),
    ]);

    let PlayButCont = add([
        sprite("BoundBox"),
        origin("topleft"),
        //pos(width()/12, height()/2),
        pos(width()/12, height()/3.5),
        scale(6, 3),
        area(),
        //body(),
        layer("top"),
        "PlayButCont"
    ]);
    
    let MuteButton = add([
        sprite("MuteBut"),
        pos(width()/2+50, 0),
        origin("topleft"),
        scale(0.28), //for 100x100
        area(),
        layer("top"),
        "MuteButton"
    ])

    let MuteButtonCont = add([
        sprite("BoundBox"),
        pos(width()/2-100, -100),
        origin("topleft"),
        scale(4), //for 100x100
        area(),
        layer("top"),
        "MuteButtonCont"
    ])
  
    onClick("PlayButCont", ()=>{
        go("game", score=0);
        if(!Mute){
            play("MCReg", {
                volume: 1
            });
        }
    })
  
    action(()=>{
        onClick("MuteButtonCont", ()  => {
            if(Mute){
                Mute = false;
            }else{
                Mute = true
            }
        })

        //debug.log(Mute)

    })

    //go("game");
})

go("main");

