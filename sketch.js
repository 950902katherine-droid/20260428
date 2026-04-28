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
        // 根據左右手設定顏色
        if (hand.handedness == "Left") {
          fill(255, 0, 255);
          stroke(255, 0, 255);
        } else {
          fill(255, 255, 0);
          stroke(255, 255, 0);
        }

        // 定義需要連線的關鍵點群組
        let connections = [
          [0, 1, 2, 3, 4],    // 大拇指
          [5, 6, 7, 8],       // 食指
          [9, 10, 11, 12],    // 中指
          [13, 14, 15, 16],   // 無名指
          [17, 18, 19, 20]    // 小指
        ];

        // 繪製連線
        strokeWeight(2);
        for (let group of connections) {
          for (let i = 0; i < group.length - 1; i++) {
            let p1 = hand.keypoints[group[i]];
            let p2 = hand.keypoints[group[i + 1]];
            let x1 = map(p1.x, 0, video.width, offsetX, offsetX + displayW);
            let y1 = map(p1.y, 0, video.height, offsetY, offsetY + displayH);
            let x2 = map(p2.x, 0, video.width, offsetX, offsetX + displayW);
            let y2 = map(p2.y, 0, video.height, offsetY, offsetY + displayH);
            line(x1, y1, x2, y2);
          }
        }

        // 繪製圓點
        noStroke();
        for (let keypoint of hand.keypoints) {
          let x = map(keypoint.x, 0, video.width, offsetX, offsetX + displayW);
          let y = map(keypoint.y, 0, video.height, offsetY, offsetY + displayH);
          circle(x, y, 12);
        }
      }
    }
  }
}

function windowResized() {
  // 視窗縮放時自動調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
