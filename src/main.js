/*  global mina */

import Snap from "snapsvg";
import Noise from "./noise";

document.addEventListener("DOMContentLoaded", () => {
  const s = Snap("#svg");
  s.attr({ viexBox: "0 0 800 600" });
  s.attr({ viexBox: "180 50 650 400" });
  s.attr({ width: "100%", height: "100%" });
  s.attr({ align: "xMinyMin", meetOrSlice: "slice" });

  // loading
  const loading = s.circle(580, 180, 0);
  loading.attr({
    stroke: "#f99", strokeWidth: 10, opacity: 0.2, fill: "transparent",
  });
  loading.animate({ r: 100 }, 7000, mina.easeout);

  // noise
  const noise = new Noise();
  let silence = true;

  // interaction
  const left = s.group();
  left.attr({ id: "left" });
  const pleft = new Promise((resolve, reject) => {
    Snap.load("assets/left.svg", (leftFragment) => {
      if (leftFragment === null) {
        return reject(new Error("left not loaded"));
      }
      left.append(leftFragment.node);
      const trans = new Snap.Matrix();
      trans.scale(0.5);
      trans.translate(0, 300);
      left.transform(trans);
      return resolve(true);
    });
  });

  const right = s.group();
  right.attr({ id: "right" });
  const pright = new Promise((resolve, reject) => {
    Snap.load("assets/right.svg", (rightFragment) => {
      if (rightFragment === null) {
        return reject(new Error("right not loaded"));
      }
      right.append(rightFragment.node);
      const trans = new Snap.Matrix();
      trans.scale(0.5);
      trans.translate(1200, 0);
      right.transform(trans);
      return resolve(true);
    });
  });

  const interaction = s.group();
  interaction.attr({ id: "interaction" });
  const bigCircle = interaction.circle(580, 180, 0);
  bigCircle.attr({ opacity: 0 });

  function down() {
    bigCircle.animate({ opacity: 0 }, 200);
    right.stop();
    left.stop();
    right.animate({ transform: "matrix(0.5,0,0,0.5,470,0)" }, 200, mina.easeout, () => {
      noise.play();
      silence = false; // now that silence has been broken, we will have to noise.stop
      right.animate({ transform: "matrix(0.5,0,0,0.5,600,0)" }, 200, mina.easeout);
      left.animate({ transform: "matrix(0.5,0,0,0.5,130,150)" }, 200, mina.easeout, () => {
        left.animate({}, 1000, null, () => {
          left.animate({ transform: "matrix(0.5,0,0,0.5,0,150)" }, 150, mina.easeout);
        });
      });
    });
  }

  function up() {
    right.stop();
    left.stop();
    if (!silence) noise.stop();
    left.animate({ transform: "matrix(0.5,0,0,0.5,0,150)" }, 150, mina.easeout);
    right.animate({ transform: "matrix(0.5,0,0,0.5,600,0)" }, 200, mina.easeout);
  }

  interaction.mousedown(down);
  interaction.mouseup(up);

  // when loading
  Promise.all([pleft, pright, noise.loadFirst()]).then(() => {
    bigCircle.attr({ fill: "#f99", opacity: ".2" });
    bigCircle.animate({ r: 100 }, 1000, mina.bounce);
    loading.stop();
    loading.remove();
  }).catch((err) => {
    console.log(err);
  });
});
