class planetoid {
  constructor() {
    this.x = random(100, width - 100); //width / 2;
    this.y = random(100, height - 100); //height / 2;
    this.mass = random(50, 150);
    this.counter = [0, 8, 16];

    this.col = [random(0, 255)];
    this.col[1] = random(0, 255);
    this.col[2] = 255 - this.col[0];

    let params = {
      isStatic: true,
      friction: 0.01,
      mass:200,
      plugin: {
        attractors: [
          function(bodyA, bodyB) {
            return {
              x: (bodyA.position.x - bodyB.position.x) * 1e-6,
              y: (bodyA.position.y - bodyB.position.y) * 1e-6,
            };
          }
        ]
      }
    };

    this.body = Bodies.circle(this.x, this.y, this.mass / 2, params);
    World.add(engine.world, this.body);

    console.log(this.body);
  }

  render() {
    let max = 24;
    let pos = this.body.position;
    
    push();
    translate(pos.x, pos.y);
    noStroke();
    fill(255);
    ellipse(0, 0, this.mass, this.mass);

    blendMode(SCREEN);
    fill(this.col[0], this.col[1], this.col[2], 255 - 255 / max * this.counter[0]);
    ellipse(0, 0, this.mass + this.counter[0], this.mass + this.counter[0]);
    fill(this.col[0], this.col[1], this.col[2], 255 - 255 / max * this.counter[1]);
    ellipse(0, 0, this.mass + this.counter[1], this.mass + this.counter[1]);
    fill(this.col[0], this.col[1], this.col[2], 255 - 255 / max * this.counter[2]);
    ellipse(0, 0, this.mass + this.counter[2], this.mass + this.counter[2]);

    this.counter[0] += 0.1;
    this.counter[1] += 0.1;
    this.counter[2] += 0.1;

    if (this.counter[0] >= max) {
      this.counter[0] = 0;
    }
    if (this.counter[1] >= max) {
      this.counter[1] = 0;
    }
    if (this.counter[2] >= max) {
      this.counter[2] = 0;
    }
    blendMode(BLEND);
    pop();
  }
}

class satellite {
  constructor(_count) {
    this.pos = createVector(mouseX, mouseY);
    // this.vel = createVector(0, 0);
    // this.accel = createVector(0, 0);
    this.letgo = false;
    this.lim = 25;
    // this.trailX = [];
    // this.trailY = [];
    this.index = _count;

    // tail.push([]);

  }

  satAim() {
    if (!this.letgo) {

      let heading = Vector.create(this.pos.x, this.pos.y);
      let mousePos = Vector.create(mouseX, mouseY);

      heading = Vector.sub(heading, mousePos);
      stroke(255);
      strokeWeight(2);
      // heading.limit(this.lim * 5);
      if (Vector.magnitudeSquared(heading) > this.lim * this.lim){
        heading = Vector.normalise(heading);
        heading = Vector.mult(heading, this.lim);
      }

      line(this.pos.x, this.pos.y, this.pos.x - heading.x, this.pos.y - heading.y);

      // heading.limit(this.lim);
      noStroke();
      fill(255);
      push();
      translate(this.pos.x, this.pos.y);
      this.ship(heading.x, heading.y);
      // ellipse(0, 0, 30, 10);

      heading = Vector.mult(heading, 0.2);
      this.vel = Vector.clone(heading);
      pop();
      
    }
  }

  satLaunch() {
    let thrust = Vector.create((this.pos.x - mouseX) * 1e-7, (this.pos.y - mouseY) * 1e-7);
    
    let params = {
      mass: 1,
      force: {x: thrust.x, y: thrust.y}
    }

    this.body = Bodies.circle(this.pos.x, this.pos.y, 3, params);
    World.add(engine.world, this.body);


    
    // thrust = Vector.div(thrust, this.body.mass);    

    // this.vel.add(this.accel);
    this.letgo = true;
    // this.accel = createVector(0, 0);
    // this.trailX[0] = this.pos.x;
    // this.trailY[0] = this.pos.y;
  }

  // velUpdate(_x, _y, _mass) {
  //   if (this.letgo) {
  //     let gDir = createVector(_x, _y);
  //     gDir.sub(this.pos);
  //     let gMag = (g * _mass) / gDir.magSq();
  //     gDir.setMag(gMag);

  //     this.vel.add(gDir);
  //   }
  //   this.vel.limit(this.lim);
  // }

  satShow() {
    if (this.letgo) {
      let pos = this.body.position;
      let vel = this.body.velocity;

      let heading = Vector.clone(pos.x, pos.y);
      pos = Vector.add(pos, vel);

      // tail[this.index].push(new trail(this.pos.x, this.pos.y));

      heading = Vector.sub(heading, pos);
      fill(255);
      push();
      noStroke();
      translate(pos.x, pos.y);
      rotate(PI);
      this.ship(heading.x, heading.y);
      pop();
    }
  }

  ship(_x, _y) {
    let angle = atan(_y / _x);
    if (_x >= 0) {
      angle += PI;
    }
    rotate(angle);

    beginShape();
    vertex(0, 0);
    vertex(8, 3);
    vertex(7, 0);
    vertex(8, -3);
    endShape(CLOSE);
  }
}



class block {
  constructor() {
      this.size = random(5, 20);
      let maxForce = 0.05;
     
      let params = {
          friction: 0.1,
          mass: 1,
          force: {x: random(-maxForce, maxForce), y: random(-maxForce, maxForce)} 
        };

      this.body = Bodies.rectangle(random(width), random(height), this.size, this.size, params);
      World.add(engine.world, this.body);

      console.log(this.body);
  }

  resolveForces(_p, _f){

    // Matter.Body.applyForce(this.body, _p, _f);
    this.body.force.x += force.x;
    this.body.force.y += force.y;
    var offset = { x: _p.x - this.body.position.x, y: _p.y - this.body.position.y };
    this.body.torque += offset.x * _f.y - offset.y * _f.x;
  }

  render(){
      let pos = this.body.position;
      let ang = this.body.angle;

      push();
      translate(pos.x, pos.y);
      rotate(ang);
      stroke(200 );
      strokeWeight(2);
      fill(200, 127);
      rectMode(CENTER);
      rect(0, 0, this.size, this.size);
      pop();
  }
}




// class trail {
//   constructor(_x, _y) {
//     this.x = _x;
//     this.y = _y;
//   }

//   trailShow() {
//     stroke(255);
//     strokeWeight(0.5);
//     noFill();
//     // point(this.x, this.y);
//     ellipse(this.x, this.y, 2, 2);
//   }
// }

// class crashSite {
//   constructor(_x, _y, _x2, _y2) {
//     this.pos = createVector(_x, _y);
//     this.pos2 = createVector(_x2, _y2);

//     this.vel = this.pos.copy();
//     this.vel.sub(this.pos2.x, this.pos2.y);
//     this.vel.setMag(random(2, 4));
//     this.vel.rotate(random(-PI / 6, PI / 6));

//     this.acc = this.pos.copy();
//     this.acc.sub(this.pos2.x, this.pos2.y);
//     this.acc.setMag(-0.1);

//     // this.up = this.pos.copy();
//     // this.up.sub(this.pos2.x, this.pos2.y);
//     // this.dn = this.pos.copy();
//     // this.dn.setMag(0.2);
//     // this.up.setMag(random(2, 4));
//     // this.up.rotate(random(-PI / 6, PI / 6));
//     this.rad = random(5, 20);

//     this.col = [255, random(150, 250), 0];
//   }

//   crashUpdate() {
//     this.acc = this.pos.copy();
//     this.acc.sub(this.pos2.x, this.pos2.y);
//     this.acc.setMag(-0.1);

//     this.vel.add(this.acc);
//     this.pos.add(this.vel);

//     // this.dn = this.pos.copy();
//     // this.dn.setMag(0.2);
//     // this.up.sub(this.dn);
//     // this.pos.add(this.up);
//   }

//   crashShow() {
//     noStroke();
//     fill(this.col[0], this.col[1], this.col[2]);
//     if (this.rad > 0) {
//       ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
//     }
//     this.rad -= 0.5;
//   }
// }

// class stream {
//   constructor(_x, _y, _x2, _y2) {
//     this.pos = createVector(_x, _y);

//     this.away = createVector(0, 0);
//     this.away.sub(_x2, _y2);

//     let exhaust = this.away.copy();
//     exhaust.setMag(7);
//     this.pos.add(exhaust);
//     this.away.rotate(random(-PI / 10, PI / 10));

//     this.col = [255, random(100, 125), 0, 255];
//     this.rad = random(5, 10);
//   }

//   streamUpdate() {
//     this.pos.add(this.away);
//   }

//   streamShow() {
//     noStroke();
//     fill(this.col[0], this.col[1], this.col[2], this.col[3]);
//     if (this.rad > 0) {
//       ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
//     }
//     this.rad -= 0.2;
//     this.col[1] -= 10;
//     this.col[3] -= 5;
//   }
// }