const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const World = Matter.World;
const Vector = Matter.Vector;

Matter.use(
    'matter-attractors' // PLUGIN_NAME
  );

let engine;
let world;


let g = 3;
let orbs = [];
let box = [];
let sats = [];
let satCount = 0;

function setup() {
    createCanvas(800, 800);

    engine = Engine.create();
    world = engine.world;
    world.gravity.scale = 0;

    for (let i = 0; i < 1; i++) {
        orbs[i] = new planetoid();
    }

    for (let i = 0; i <200; i++) {
        box[i] = new block();
    }
   

    // World.add(world, ground);
}

function draw(){
    background(0);

    // Engine.run(engine);
    Engine.update(engine, 1000 / 30)

    // for (let i = 0; i < orbs.length; i++){

    //     // let dSquared = Vector.create(box[0].body.position.x - orbs[i].body.position.x, 
    //     //     box[0].body.position.y - orbs[i].body.position.y);

    //     // let gStrength = g * orbs[i].mass / dSquared.magnitudeSquared;
        
    //     // dSquared = Vector.normalise(dSquared);
    //     // let gForce = Vector.mult(dSquared, gStrength);

    //     box[0].resolveForces({x: 200, y: 200}, {x: 0.5, y: 0.5});//gForce);
    // }

    for (let q of sats) {
            q.satAim();
            q.satShow();
    }

    for (let q of orbs){
        q.render();
    }

    for (let q of box) {
        q.render();
    }

}


// let tail = [
//   []
// ];
// let crashes = [];
// let jet = [];


// function setup() {


// }

// function draw() {
//   let killList = [];

//   background(0);

//   for (let i = 0; i < orbs.length; i++) {
//     orbs[i].render();
//     for (let j = 0; j < sats.length; j++) {
//       sats[j].velUpdate(orbs[i].x, orbs[i].y, orbs[i].mass);
//     }
//   }

//   for (let i = 0; i < tail.length; i++) {
//     for (let j = 0; j < tail[i].length; j += 4) {
//       tail[i][j].trailShow();
//     }
//   }

//   for (let i = 0; i < sats.length; i++) {
//     if (sats[i].letgo == true) {
//       jet.push(new stream(sats[i].pos.x, sats[i].pos.y, sats[i].vel.x, sats[i].vel.y));
//     }
//   }

//   for (let q of jet) {
//     q.streamUpdate();
//     q.streamShow();
//   }

//   for (let q of sats) {
//     q.satAim();
//     q.satShow();
//   }

//   if (sats.length > 0) {
//     for (let i = 0; i < sats.length; i++) {
//       for (let j = 0; j < orbs.length; j++) {
//         let distSquared = sq(sats[i].pos.x - orbs[j].x) + sq(sats[i].pos.y - orbs[j].y);

//         if (distSquared < sq(orbs[j].mass / 2) || sats[i].pos.x > 1000 ||
//           sats[i].pos.x < -400 || sats[i].pos.y > 1000 || sats[i].pos.y < -400) {
//           killList.push(i);
//           for (let k = 0; k < 40; k++) {
//             crashes.push(new crashSite(sats[i].pos.x, sats[i].pos.y, orbs[j].x, orbs[j].y));
//           }
//         }
//       }
//     }
//   }

//   for (let i = 0; i < jet.length; i++) {
//     if (jet[i].rad < 1) {
//       jet.splice(i, 1);
//     }
//   }

//   for (let i = 0; i < crashes.length; i++) {
//     if (crashes[i].rad < 1) {
//       crashes.splice(i, 1);
//     }
//   }

//   for (let q of crashes) {
//     q.crashUpdate();
//     q.crashShow();
//   }

//   for (let i = 0; i < killList.length; i++) {
//     sats.splice(killList[i], 1);
//   }

// }

function mousePressed() {
  sats.push(new satellite(satCount++));
}

function mouseReleased() {
  sats[sats.length - 1].satLaunch();
}