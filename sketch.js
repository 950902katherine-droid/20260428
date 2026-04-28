// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let bubbles = []; // 儲存所有產生的水泡

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

  // 在上方加上文字，置中
  fill(0);
  noStroke();
  textSize(24);
  textAlign(CENTER, TOP); // 設定文字對齊方式為置中、靠上
  text("414730357林翊涵", width / 2, 20); // 將文字顯示在畫布中央上方
  textAlign(LEFT, BASELINE); // 重設文字對齊方式為預設 (左對齊、基線對齊)

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

        // 在指尖 (4, 8, 12, 16, 20) 產生水泡
        let tipIndices = [4, 8, 12, 16, 20];
        for (let idx of tipIndices) {
          let kp = hand.keypoints[idx];
          let bx = map(kp.x, 0, video.width, offsetX, offsetX + displayW);
          let by = map(kp.y, 0, video.height, offsetY, offsetY + displayH);
          
          // 控制產生頻率，避免水泡過多
          if (frameCount % 10 === 0) {
            bubbles.push({
              x: bx,
              y: by,
              size: random(8, 18),
              popY: by - random(50, 150) // 設定隨機破掉的高度
            });
          }
        }
      }
    }
  }

  // 更新並繪製水泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    b.y -= 2; // 水泡往上飄
    
    noFill();
    stroke(255);
    strokeWeight(1);
    circle(b.x, b.y, b.size);

    // 如果水泡到達破掉高度或超出螢幕，則移除
    if (b.y < b.popY || b.y < 0) {
      bubbles.splice(i, 1);
    }
  }
}

function windowResized() {
  // 視窗縮放時自動調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
