import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
  //var kaboom = require("kaboom")
  //import kaboom from 'kaboom';
 // initialize kaboom context
kaboom({
    width: 600,
    height:1200,
    background: [ 255, 255, 255, ],//[ 0, 0, 0, ],
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


let SPEED = 600;    
let score = 0; 
let fuel = 11;
let right = true;

//loadFont("MCF", "/fonts/MCFont_10x8.png", 10, 8);
//loadSprite("track1", "assets/track1.jpg");
loadSprite("track1", "assets/track bg.png");
/*
loadSprite("track2", "assets/track2.jpg");
loadSprite("track3", "assets/track3.jpg");
loadSprite("track4", "assets/track4.jpg");
loadSprite("track5", "assets/track5.jpg");
loadSprite("track6", "assets/track6.jpg");
loadSprite("track7", "assets/track7.jpg");
*/

//loadSprite("Track3", "assets/3railtrack.jpg");

/*
loadSprite("train", "assets/FullTrainSprite 2.png", {
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
*/

loadSprite("train", "assets/FullTrainSprite 3.png", {
    sliceX: 11,
    sliceY: 1,
    anims:{
        "Left":{
            from: 5,
            to:10,
            speed:35,
        },
        "Right":{
            from:0,
            to:5,
            speed:35,
        }
    }
});

//loadSprite("smokeAnim", "assets/smokeAnim.png", {
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
loadSprite("ScoreText", "assets/score_text.png");
//For main menu
loadSprite("Main", "assets/Main.jpg");

// For end page 
//loadSprite("EndPage", "assets/endPage.jpg");
loadSprite("EndPage", "assets/endPagetrans.png");

loadSprite("BoundBox", "assets/boundingbox.png");



//audio
loadSound("MCReg", "./assets/audio/MCReg.mp3");
loadSound("crash", "./assets/audio/crash.mp3");

var Mute = false; 

scene("game", (score, Mute, SPEED) => {

    //fullscreen(true);

    layers([
        "bot",
        "mid",
        "top"
    ], "top");
    
    
    //for background track
    onUpdate(()=>{
        if(TrackbgOne.pos.y>=3776)
            {
                //alert("negative position of train")
                
                TrackbgOne.moveTo(0,0);
                TrackbgTwo.moveTo(0,-3776);
                //debug.log(Track)
                
            }
    })
    
    


    //add train
    
    let Train = add([
        sprite("train"),
        origin("botleft"),
        pos(178, height()),
        scale(0.7),
        area(),
        //body(),
        layer("mid"),
    ]);

    /*
    let Train = add([
        sprite("train"),
        origin("botleft"),
        pos(100, height()),
        scale(2.2),
        area(),
        //body(),
        layer("mid"),
    ]);
    */
    let TrackbgOne = add([
        sprite("track1"),
        origin("topleft"),
        pos(0, 0),
        scale(1),
        //scale(0.5),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgOne"
    ]);

    let TrackbgTwo = add([
        sprite("track1"),
        origin("topleft"),
        pos(0, -3776),
        scale(1),
        //scale(0.5),
        area(),
        move(DOWN, SPEED),
        layer("bot"),
        "TrackbgTwo"
    ]);


    let TrainCol = add([
        sprite("BoundBox"),
        origin("botleft"),
        pos(178, height()),
        scale(1, 7),
        area(),
        //body(),
        layer("mid"),
        "TrainCol"
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

 

    //For spawning boosters
    function spawnObstacleLeft(){
        //add coins 
        let TrainObsLeft = add([
            sprite("TrainObsLeft"),
            pos(180, -rand(1000, 2000)),
            area(),
            origin("botleft"),
            layer("mid"),
            scale(1),
            move(DOWN, SPEED+30),
            "TrainObsLeft", // add a tag here
        ]);

        TrainCol.collides("TrainObsLeft", () => {
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
            shake(40)
            if(!IOS)
                navigator.vibrate(200)
            if(!Mute){
                play("crash", {
                    volume: 0.8
                });
            }
          Train.destroy();
            wait(0.6, ()=>{
                go("lose", (scoreLabel.text), Mute);
            })
            //loseWindow(score);
        });

    // wait a random amount of time to spawn next boost
    wait(rand(23, 25), (spawnObstacleLeft));
}

    //start spawning obstacles
    spawnObstacleLeft();



    function spawnObstacleRight(){
        //add coins 
    
        let TrainObsRight = add([
            sprite("TrainObsRight"),
            pos(340, -rand(4000, 5000)),
            area(),
            origin("botleft"),
            layer("mid"),
            scale(1),
            move(DOWN, SPEED+60),
            "TrainObsRight", // add a tag here
        ]);

        TrainCol.collides("TrainObsRight", () => {
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
            shake(40)
            if(!IOS)
                navigator.vibrate(200)
            if(!Mute){
                play("crash", {
                    volume: 0.8
                });
            }
            Train.destroy();
            wait(0.6, ()=>{
                go("lose", (scoreLabel.text), Mute);
            })
               
            //loseWindow(score);
        });
    // wait a random amount of time to spawn next boost
    wait(rand(15, 17), (spawnObstacleRight));
    }

    //start spawning obstacles
    spawnObstacleRight();

    function moveToRight(){
        TrainCol.moveTo(350, height())
    }

    function moveToLeft(){
        TrainCol.moveTo(178, height())
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
    /*
    add([
        text("score:"),
        pos(250, 24),
        scale(0.4),
        layer("mid"),
    ])
    */
    let ScoreText = add([
        sprite("ScoreText"),
        pos(20, 45),
        scale(0.15),
        origin("topleft"),
        layer("top"),
    ])


    let scoreLabel = add([
        text(score),
        pos(150, 45),
        scale(0.5),
        origin("topleft"),
        layer("mid"),
    ])


    let MuteButton = add([
        sprite("MuteBut"),
        pos(width()/2+50, 0),
        origin("topleft"),
        scale(0.28), //for 100x100
        area(),
        layer("top"),
        "MuteButton"
    ])

    action(()=>{

        onClick("MuteButtonCont", ()  => {
            if(Mute){
                Mute = false;
            }else{
                Mute = true
            }
        })

       // debug.log(Mute)

       if(Math.floor(timer())%10==0){
            debug.log(SPEED)
            SPEED+=30;
       }
        
        score+=0.2;
        scoreLabel.text = Math.floor(score);
    })

});


scene("lose", (score, Mute) => {
   
    add([
        sprite("EndPage"),
        origin("topleft"),
        pos(0, 0),
        scale(1),
        area(),
        //body(),
        layer("mid"),
    ]);

    //add scores

    let scoreLabel = add([
        text(Math.floor(score)),
        pos(width()/2, height()/2-120),
        scale(0.5),
        origin("center"),
        layer("top"),
    ])
    

    let TryButCont = add([
        sprite("BoundBox"),
        origin("topleft"),
        pos(width()/12, height()/12),
        scale(6),
        area(),
        //body(),
        layer("mid"),
        "TryButCont"
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

    action(()=>{
        onClick("MuteButtonCont", ()  => {
            if(Mute){
                Mute = false;
            }else{
                Mute = true
            }
        })

    })
        

    //var x = document.getElementById("myInput").value = score;
    onClick("TryButCont", ()=>{
        if(!Mute){
            play("MCReg", {
                volume: 1
            });
        }
        go("game", score=0, Mute, SPEED=500);
    })
})


scene("main", (Mute) => {
    var Mute = false;
    add([
        sprite("Main"),
        origin("topleft"),
        pos(0, 0),
        scale(1),
        area(),
        //body(),
        layer("mid"),
    ]);

    let PlayButCont = add([
        sprite("BoundBox"),
        origin("topleft"),
        pos(width()/12, height()/3.5),
        scale(6, 7),
        area(),
        //body(),
        layer("mid"),
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
        if(!Mute){
            play("MCReg", {
                volume: 1
            });
        }
        go("game", score=0, Mute, SPEED);
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
  
})


function loseWindow(score){
    let endbg = add([
        //sprite(choose(["track1", "track2", "track3", "track4", "track5", "track6", "track7"])),
        sprite("EndPage"),
        origin("topleft"),
        pos(0, 0),
        scale(1),
        area(),
        layer("top"),
        "endbg"
    ]);

    let TryButCont = add([
        sprite("BoundBox"),
        origin("topleft"),
        pos(width()/12, height()/12),
        scale(6),
        area(),
        //body(),
        layer("mid"),
        "TryButCont"
    ]);

    let scoreLabel = add([
        text(Math.floor(score)),
        pos(width()/2-30, height()/2 -150),
        scale(1),
        layer("top"),
    ])

    //var x = document.getElementById("myInput").value = score;
    onClick("TryButCont", ()=>{
        go("game", score=0, Mute, SPEED);
    })
};


go("main");

