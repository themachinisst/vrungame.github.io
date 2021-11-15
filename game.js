import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
  //var kaboom = require('kaboom')
 // initialize kaboom context
//For phone 
  /*
kaboom({
    width: 450,
    height: 800,
});
*/
kaboom({
    width: 450,
    height:550,
});

let SPEED = 500;    
let score = 0; 
let fuel = 11;
let right = false

loadSprite("bg", "assets/bgtwice.jpg");
loadSprite("train", "assets/train.png");


scene("game", () => {

    layers([
        "bot",
        "mid",
        "top"
    ], "top");
    
    //for background track
    const Trackbg = add([
        sprite("bg"),
        origin("botleft"),
        pos(0, 550),
        scale(0.43),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
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
        pos(90, 600),
        scale(1.5),
        area(),
        body(),
        layer("top"),
    ]);

    function changeTrack(){
        if(right==false){
            Train.action(() => {
                Train.moveTo(280 ,600);
            });
            right = true;
        }else{
            Train.action(() => {
                Train.moveTo(90, 600);
            });

            right = false;
        };
    };

    mouseClick(changeTrack);

    //add scores
    add([
        text("score: "),
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

});

go("game");
