// for instruction page script

let handPose;
let video;
let hand = null; // Store only ONE hand

function preload() {
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(400, 300);
    video = createCapture(VIDEO);
    video.size(400, 300);
    video.hide();
    handPose.detectStart(video, gotHands);
}

function draw() {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    if (hand) {
        if (isFingerStretched(hand, "index_finger")) {
            let direction = isFingerPointingLeftRight(hand, "index_finger");

            if (direction === "right") {
                console.log("Index finger is pointing RIGHT 👉");
            } else if (direction === "left") {
                console.log("Index finger is pointing LEFT 👈");
            }
        }

        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            let mirroredX = width - keypoint.x;

            fill(0, 255, 0);
            noStroke();
            circle(mirroredX, keypoint.y, 10);
        }
    }
}

// Store only the first detected hand
function gotHands(results) {
    hand = results.length > 0 ? results[0] : null;
}

function isFingerStretched(hand, fingerName) {
    let tip = hand.keypoints.find(k => k.name === `${fingerName}_tip`);
    let dip = hand.keypoints.find(k => k.name === `${fingerName}_dip`);
    let pip = hand.keypoints.find(k => k.name === `${fingerName}_pip`);
    let mcp = hand.keypoints.find(k => k.name === `${fingerName}_mcp`);
    let wrist = hand.keypoints.find(k => k.name === "wrist");

    if (!tip || !dip || !pip || !mcp || !wrist) return false;

    let handLength = dist(wrist.x, wrist.y, mcp.x, mcp.y);
    let stretchDistance = dist(tip.x, tip.y, mcp.x, mcp.y);
    let isFarEnough = stretchDistance > handLength * 0.6;
    let isStraight = tip.y < dip.y && dip.y < pip.y && pip.y < mcp.y;

    return isFarEnough && isStraight;
}

function isFingerPointingLeftRight(hand, fingerName) {
    let tip = hand.keypoints.find(k => k.name === `${fingerName}_tip`);
    let mcp = hand.keypoints.find(k => k.name === `${fingerName}_mcp`);

    if (!tip || !mcp) return "unknown";

    return tip.x > mcp.x ? "left" : "right"; // Adjusted for mirrored video
}
