let g = 3;
let orbs = [];
let sats = [];
let tail = [
  []
];
let crashes = [];
let jet = [];
let satCount = 0;

function setup() {
  createCanvas(600, 600);
  for (let i = 0; i < 2; i++) {
    orbs[i] = new planetoid();
  }

}

function draw() {
  let killList = [];

  background(0);

  for (let i = 0; i < orbs.length; i++) {
    orbs[i].render();
    for (let j = 0; j < sats.length; j++) {
      sats[j].velUpdate(orbs[i].x, orbs[i].y, orbs[i].mass);
    }
  }

  for (let i = 0; i < tail.length; i++) {
    for (let j = 0; j < tail[i].length; j += 4) {
      tail[i][j].trailShow();
    }
  }

  for (let i = 0; i < sats.length; i++) {
    if (sats[i].letgo == true) {
      jet.push(new stream(sats[i].pos.x, sats[i].pos.y, sats[i].vel.x, sats[i].vel.y));
    }
  }

  for (let q of jet) {
    q.streamUpdate();
    q.streamShow();
  }

  for (let q of sats) {
    q.satAim();
    q.satShow();
  }

  if (sats.length > 0) {
    for (let i = 0; i < sats.length; i++) {
      for (let j = 0; j < orbs.length; j++) {
        let distSquared = sq(sats[i].pos.x - orbs[j].x) + sq(sats[i].pos.y - orbs[j].y);

        if (distSquared < sq(orbs[j].mass / 2) || sats[i].pos.x > 1000 ||
          sats[i].pos.x < -400 || sats[i].pos.y > 1000 || sats[i].pos.y < -400) {
          killList.push(i);
          for (let k = 0; k < 40; k++) {
            crashes.push(new crashSite(sats[i].pos.x, sats[i].pos.y, orbs[j].x, orbs[j].y));
          }
        }
      }
    }
  }

  for (let i = 0; i < jet.length; i++) {
    if (jet[i].rad < 1) {
      jet.splice(i, 1);
    }
  }

  for (let i = 0; i < crashes.length; i++) {
    if (crashes[i].rad < 1) {
      crashes.splice(i, 1);
    }
  }

  for (let q of crashes) {
    q.crashUpdate();
    q.crashShow();
  }

  for (let i = 0; i < killList.length; i++) {
    sats.splice(killList[i], 1);
  }

}

function mousePressed() {
  sats.push(new satellite(satCount++));
}

function mouseReleased() {
  sats[sats.length - 1].satLaunch();
}