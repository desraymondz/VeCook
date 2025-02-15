// for instruction page script

/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

let handPose;
let video;
let hands = [];

function preload() {
    // Load the handPose model
    handPose = ml5.handPose();
}

function setup() {
    createCanvas(400, 300);
    // Create the webcam video and hide it
    video = createCapture(VIDEO);
    video.size(400, 300);
    video.hide();
    // start detecting hands from the webcam video
    handPose.detectStart(video, gotHands);
}

function draw() {
    // Draw the webcam video
    image(video, 0, 0, width, height);

    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];

        if (isFingerStretched(hands[0], "index_finger")) {
            let direction = isFingerPointingLeftRight(hands[0], "index_finger");
            
            if (direction === "right") {
                console.log("Index finger is pointing RIGHT 👉");
            } else if (direction === "left") {
                console.log("Index finger is pointing LEFT 👈");
            }
        }

        
        for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
        }
    }
}

// Callback function for when handPose outputs data
function gotHands(results) {
    // save the output to the hands variable
    hands = results;
}

function isFingerStretched(hand, fingerName) {
    let tip = hand.keypoints.find(k => k.name === `${fingerName}_tip`);
    let dip = hand.keypoints.find(k => k.name === `${fingerName}_dip`);
    let pip = hand.keypoints.find(k => k.name === `${fingerName}_pip`);
    let mcp = hand.keypoints.find(k => k.name === `${fingerName}_mcp`);
    let wrist = hand.keypoints.find(k => k.name === "wrist");

    if (!tip || !dip || !pip || !mcp || !wrist) return false; // Ensure all keypoints exist

    // Calculate hand size (wrist to MCP distance as a reference)
    let handLength = dist(wrist.x, wrist.y, mcp.x, mcp.y);

    // Calculate how far the finger tip is from MCP
    let stretchDistance = dist(tip.x, tip.y, mcp.x, mcp.y);

    // Proportional threshold: The tip should be at least 0.7x the hand length
    let isFarEnough = stretchDistance > handLength * 0.6;

    // Check if joints are in a straight line
    let isStraight = tip.y < dip.y && dip.y < pip.y && pip.y < mcp.y;

    return isFarEnough && isStraight;
}

function isFingerPointingLeftRight(hand, fingerName) {
    let tip = hand.keypoints.find(k => k.name === `${fingerName}_tip`);
    let mcp = hand.keypoints.find(k => k.name === `${fingerName}_mcp`);

    if (!tip || !mcp) return "unknown"; // If keypoints are missing

    return tip.x > mcp.x ? "right" : "left";
}