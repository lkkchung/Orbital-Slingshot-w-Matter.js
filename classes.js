class planetoid {
  constructor() {
    this.x = random(100, width - 100); //width / 2;
    this.y = random(100, height - 100); //height / 2;
    this.mass = random(50, 150);
    this.counter = [0, 8, 16];

    this.col = [random(0, 255)];
    this.col[1] = random(0, 255);
    this.col[2] = 255 - this.col[0];
  }

  render() {
    let max = 24;
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.mass, this.mass);

    blendMode(SCREEN);
    fill(this.col[0], this.col[1], this.col[2], 255 - 255 / max * this.counter[0]);
    ellipse(this.x, this.y, this.mass + this.counter[0], this.mass + this.counter[0]);
    fill(this.col[0], this.col[1], this.col[2], 255 - 255 / max * this.counter[1]);
    ellipse(this.x, this.y, this.mass + this.counter[1], this.mass + this.counter[1]);
    fill(this.col[0], this.col[1], this.col[2], 255 - 255 / max * this.counter[2]);
    ellipse(this.x, this.y, this.mass + this.counter[2], this.mass + this.counter[2]);

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
  }
}

class satellite {
  constructor(_count) {
    this.pos = createVector(mouseX, mouseY);
    this.vel = createVector(0, 0);
    this.accel = createVector(0, 0);
    this.letgo = false;
    this.lim = 8;
    this.trailX = [];
    this.trailY = [];
    this.index = _count;

    tail.push([]);
  }

  satAim() {
    if (!this.letgo) {
      let heading = createVector(this.pos.x, this.pos.y);
      let mousePos = createVector(mouseX, mouseY);

      heading.sub(mousePos);
      stroke(255);
      strokeWeight(2);
      heading.limit(this.lim * 5);
      line(this.pos.x, this.pos.y, this.pos.x - heading.x, this.pos.y - heading.y);

      heading.limit(this.lim);
      noStroke();
      fill(255);
      push();
      translate(this.pos.x, this.pos.y);
      this.ship(heading.x, heading.y);
      // ellipse(0, 0, 30, 10);

      heading.mult(0.2);
      this.accel = heading.copy();
      pop();
    }
  }

  satLaunch() {
    this.vel.add(this.accel);
    this.letgo = true;
    this.accel = createVector(0, 0);
    this.trailX[0] = this.pos.x;
    this.trailY[0] = this.pos.y;
  }

  velUpdate(_x, _y, _mass) {
    if (this.letgo) {
      let gDir = createVector(_x, _y);
      gDir.sub(this.pos);
      let gMag = (g * _mass) / gDir.magSq();
      gDir.setMag(gMag);

      this.vel.add(gDir);
    }
    this.vel.limit(this.lim);

  }

  satShow() {
    if (this.letgo) {
      let heading = createVector(this.pos.x, this.pos.y);
      this.pos.add(this.vel);

      tail[this.index].push(new trail(this.pos.x, this.pos.y));

      heading.sub(this.pos);
      fill(255);
      push();
      noStroke();
      translate(this.pos.x, this.pos.y);
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

class trail {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
  }

  trailShow() {
    stroke(255);
    strokeWeight(0.5);
    noFill();
    // point(this.x, this.y);
    ellipse(this.x, this.y, 2, 2);
  }
}

class crashSite {
  constructor(_x, _y, _x2, _y2) {
    this.pos = createVector(_x, _y);
    this.pos2 = createVector(_x2, _y2);

    this.vel = this.pos.copy();
    this.vel.sub(this.pos2.x, this.pos2.y);
    this.vel.setMag(random(2, 4));
    this.vel.rotate(random(-PI / 6, PI / 6));

    this.acc = this.pos.copy();
    this.acc.sub(this.pos2.x, this.pos2.y);
    this.acc.setMag(-0.1);

    // this.up = this.pos.copy();
    // this.up.sub(this.pos2.x, this.pos2.y);
    // this.dn = this.pos.copy();
    // this.dn.setMag(0.2);
    // this.up.setMag(random(2, 4));
    // this.up.rotate(random(-PI / 6, PI / 6));
    this.rad = random(5, 20);

    this.col = [255, random(150, 250), 0];
  }

  crashUpdate() {
    this.acc = this.pos.copy();
    this.acc.sub(this.pos2.x, this.pos2.y);
    this.acc.setMag(-0.1);

    this.vel.add(this.acc);
    this.pos.add(this.vel);

    // this.dn = this.pos.copy();
    // this.dn.setMag(0.2);
    // this.up.sub(this.dn);
    // this.pos.add(this.up);
  }

  crashShow() {
    noStroke();
    fill(this.col[0], this.col[1], this.col[2]);
    if (this.rad > 0) {
      ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
    }
    this.rad -= 0.5;
  }
}

class stream {
  constructor(_x, _y, _x2, _y2) {
    this.pos = createVector(_x, _y);

    this.away = createVector(0, 0);
    this.away.sub(_x2, _y2);

    let exhaust = this.away.copy();
    exhaust.setMag(7);
    this.pos.add(exhaust);
    this.away.rotate(random(-PI / 10, PI / 10));

    this.col = [255, random(100, 125), 0, 255];
    this.rad = random(5, 10);
  }

  streamUpdate() {
    this.pos.add(this.away);
  }

  streamShow() {
    noStroke();
    fill(this.col[0], this.col[1], this.col[2], this.col[3]);
    if (this.rad > 0) {
      ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
    }
    this.rad -= 0.2;
    this.col[1] -= 10;
    this.col[3] -= 5;
  }
}