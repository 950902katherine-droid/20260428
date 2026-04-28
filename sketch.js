// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 設定背景顏色
  background('#e7c6ff');

  // 計算顯示影像的寬高 (整個畫布寬高的 50%)
  let displayW = width * 0.5;
  let displayH = height * 0.5;
  let offsetX = (width - displayW) / 2;
  let offsetY = (height - displayH) / 2;

  // 將影像繪製在畫布中間
  image(video, offsetX, offsetY, displayW, displayH);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // Color-code based on left or right hand
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          // 將偵測點的座標從影像原始尺寸映射到畫布上的顯示位置
          let x = map(keypoint.x, 0, video.width, offsetX, offsetX + displayW);
          let y = map(keypoint.y, 0, video.height, offsetY, offsetY + displayH);
          circle(x, y, 16);
        }
      }
    }
  }
}

function windowResized() {
  // 視窗縮放時自動調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
