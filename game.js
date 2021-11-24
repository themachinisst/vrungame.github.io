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
loadSprite("bg", "assets/bg.jpg");
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


    let TrackbgOne = add([
        sprite("bg"),
        origin("topleft"),
        pos(0, 0),
        scale(1.25, 1.5),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgOne"
    ]);

    let TrackbgTwo = add([
        sprite("bg"),
        origin("topleft"),
        pos(0, -1500),
        scale(1.25, 1.5),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgTwo"
    ]);

    onUpdate(()=>{
        if(TrackbgOne.pos.y>=1500)
            {
                //alert("negative position of train")
                TrackbgOne.moveTo(0,0);
                TrackbgTwo.moveTo(0,-1500);
            }
    })


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

    function changeTrack(){
            if(!right){
                Train.play("Left");
                Train.onUpdate(() => {
                    Train.move(dir(180).scale(SPEED))
                    if(Train.pos.x <= 100){
                        Train.pos.x = 100
                    }
                    debug.log(Train.pos.x)
                })
                right = true;
            }else{
                Train.play("Right");
                Train.onUpdate(() => {
                    Train.move(dir(0).scale(200))
                    if(Train.pos.x >= 350){
                        Train.pos.x = 350
                    }
                    debug.log(Train.pos.x)
                })
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
            go("lose", (score));
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
        pos(width()/12, height()/11),
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
        pos(width()/12, height()/4),
        scale(5),
        area(),
        //body(),
        layer("top"),
        "PlayButCont"
    ]);

    onClick("PlayButCont", ()=>{
        go("game");
    })

    //go("game");
})

go("main");

