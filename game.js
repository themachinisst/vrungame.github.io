import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
  //var kaboom = require('kaboom')
 // initialize kaboom context

kaboom({
    width: 600,
    height: 1200,
    background: [ 0, 0, 0, ],
    canvas: document.querySelector("#mycanvas"),   
    
});



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

loadSprite("TrainObsLeft", "assets/trainCabLeft.png");
loadSprite("TrainObsRight", "assets/trainCabRight.png");

//For main menu
loadSprite("Main", "assets/Main.jpg");

// For end page 
loadSprite("EndPage", "assets/endPage.jpg");


loadSprite("BoundBox", "assets/boundingbox.png");

scene("game", () => {

    layers([
        "bot",
        "mid",
        "top"
    ], "top");
    
    //for background track
    let Track = choose(["track1", "track2", "track3", "track4", "track5", "track6", "track7"]);

   onUpdate(()=>{
        if(TrackbgOne.pos.y>=2400)
            {
                //alert("negative position of train")
                TrackbgOne.moveTo(0,0);
                TrackbgTwo.moveTo(0,-2400);
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
        sprite(Track),
        origin("topleft"),
        pos(0, -2400),
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
            layer("top"),
            scale(1.6),
            move(DOWN, SPEED),
            "TrainObs", // add a tag here
        ]);

        Train.collides("TrainObs", () => {
            TrainObsLeft.destroy();
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
            layer("top"),
            scale(1.6),
            move(DOWN, SPEED),
            "TrainObs", // add a tag here
        ]);

        Train.collides("TrainObs", () => {
            TrainObsRight.destroy();
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
        pos(width()/12, height()/10),
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
        pos(width()/12, height()/2.5),
        scale(5),
        area(),
        //body(),
        layer("top"),
        "PlayButCont"
    ]);

    onClick("PlayButCont", ()=>{
        go("game", score=0);
    })

    //go("game");
})

go("main");

