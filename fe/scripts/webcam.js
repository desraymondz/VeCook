// for instruction page (webcam) script

let handPose;
let video;
let hand = null; // Store only ONE hand
let rightIndexFingerTimer = 0;
let leftIndexFingerTimer = 0;
let handTimer = 0;

// How many seconds to validate a user action
let timeToExecute = 90;

// 🎥 Video Recording Variables
let canvas;
let isRecording = false;
let mediaRecorder;
let recordedChunks = [];
let recordButton; // Button to control recording

function preload() {
    handPose = ml5.handPose();
}

function setup() {
    canvas = createCanvas(500, 375); // 🎥 Updated to use canvas
    canvas.parent('canvas-container'); // Attach the canvas to the div with id 'canvas-container'
    video = createCapture(VIDEO);
    video.size(500, 375);
    video.hide();
    handPose.detectStart(video, gotHands);

    // 🎥 Setup MediaRecorder
    const stream = canvas.elt.captureStream(20); // 1 FPS for timelapse
    mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: 2500000
    });

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };

    mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'timelapse.webm'; // 🎥 Saves as WebM
        a.click();
        window.URL.revokeObjectURL(url);
        recordedChunks = [];
    };

    // 🎥 Add record button outside canvas
    recordButton = createButton('Start Recording');
    recordButton.position(10, 384); // Adjust button position
    recordButton.mousePressed(toggleRecording);

    recordButton.style('padding', '10px 20px');
    recordButton.style('background-color', '#dc3545'); // Red background
    recordButton.style('color', 'white');
    recordButton.style('border', '2px solid #c82333'); // Darker red border
    recordButton.style('border-radius', '8px');
    recordButton.style('font-size', '16px');
    recordButton.style('cursor', 'pointer');
    recordButton.style('transition', 'all 0.3s ease'); // Smooth transition for hover effects

    // Add hover effect using mouse events
    recordButton.mouseOver(() => {
        recordButton.style('background-color', '#c82333'); // Dark red on hover
        recordButton.style('border', '2px solid #bd2130'); // Darker red border on hover
    });

    recordButton.mouseOut(() => {
        recordButton.style('background-color', '#dc3545'); // Back to base red
        recordButton.style('border', '2px solid #c82333'); // Back to base red border
    });

}

function draw() {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    if (hand) {
        let fingers = ["thumb", "index_finger", "middle_finger", "ring_finger", "pinky"];
        let stretchedFingers = fingers.filter(finger => isFingerStretched(hand, finger));

        if (stretchedFingers.length > 0) {
            // console.log("Stretched fingers:", stretchedFingers.join(", "));
        }

        // When index, middle, ring finger is open
        if (isHandOpen(hand)) {
            if (isHandOpen(hand)) {
                let fingers = ["index_finger", "middle_finger", "ring_finger"];
                for (let i = 0; i < fingers.length; i++) {
                    if (isFingerPointingUp(hand, fingers[i])) {
                        handTimer++;
                        console.log("Hand is OPEN and UP✋");
                        if (handTimer / 3 == timeToExecute) {
                            console.log("API Called: handTimer", handTimer);
                            toggleMic();
                            // TODO: maybe start recording when hands up
                            handTimer = 0;
                            // console.log(fingers[i] + " is pointing UP 👆");
                        }
                    }
                }
            } else {
                handTimer = 0;
            }
        } else if (isFingerStretched(hand, "index_finger")) {
            let direction = isFingerPointingLeftRight(hand, "index_finger");

            if (direction === "right") {
                console.log("Index finger is pointing RIGHT 👉");
                // reset the right index finger timer
                leftIndexFingerTimer = 0;

                rightIndexFingerTimer++;
                if (rightIndexFingerTimer == timeToExecute) {
                    console.log("API Called: rightIndexFingerTimer", rightIndexFingerTimer);
                    nextStep();  // Fetch and log the next step from the backend
                    rightIndexFingerTimer = 0;
                }
            } else if (direction === "left") {
                console.log("Index finger is pointing LEFT 👈");
                // reset the right index finger timer
                rightIndexFingerTimer = 0;

                leftIndexFingerTimer++;
                if (leftIndexFingerTimer == timeToExecute) {
                    prevStep();  // Fetch and log the next step from the backend
                    leftIndexFingerTimer = 0;
                }
            }
        } else {
            rightIndexFingerTimer = 0;
            leftIndexFingerTimer = 0;
            handTimer = 0;
            // console.log("timer reseted")
        }

        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            let mirroredX = width - keypoint.x;

            fill(0, 255, 0);
            noStroke();
            circle(mirroredX, keypoint.y, 10);
        }
    } else {
        rightIndexFingerTimer = 0;
        leftIndexFingerTimer = 0;
        handTimer = 0;
        // console.log("timer reseted")
    }

    // 🎥 Recording Indicator
    if (isRecording) {
        fill(255, 0, 0);
        noStroke();
        ellipse(20, 20, 20, 20);
    }

    // Progress bar
    strokeWeight(0);
    fill("orange");
    // rect(0, height - 50, map(handTimer + rightIndexFingerTimer + leftIndexFingerTimer, 0, timeToExecute, 0, width), 50);
    rect(0, height - 50, map((handTimer / 3) + rightIndexFingerTimer + leftIndexFingerTimer, 0, timeToExecute, 0, width), 50);
}

// Store only the first detected hand
function gotHands(results) {
    hand = results.length > 0 ? results[0] : null;
}

function toggleRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

function startRecording() {
    isRecording = true;
    recordedChunks = [];
    mediaRecorder.start();
    recordButton.html('Stop Recording');
    console.log("🎥 Recording started...");
}

function stopRecording() {
    isRecording = false;
    mediaRecorder.stop();
    recordButton.html('Start Recording');
    console.log("🎥 Recording stopped, saving file...");
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
    let isFarEnough = stretchDistance > handLength * 0.2; // Increased sensitivity

    // TODO: thumb and pinky not working
    // if (fingerName === "thumb") {
    //     // Check if the thumb is stretched outwards
    //     thumbIsStrecthed = dist(wrist.x, wrist.y, mcp.x, mcp.y) > handLength * 0.5;

    //     // Increase horizontal spread sensitivity for thumb
    //     return tip.x > mcp.x + handLength * 0.05; // Increase this value for more sensitivity
    // } else if (fingerName === "pinky") {
    //     // Increase vertical sensitivity for pinky
    //     return isFarEnough && tip.y < dip.y && tip.x < mcp.x; // Ensure the pinky is stretched outwards
    // } else {
    //     // Normal fingers: check vertical straightness
    //     return isFarEnough && tip.y < dip.y && dip.y < pip.y && pip.y < mcp.y;
    // }
    // Normal fingers: check vertical straightness
    return isFarEnough && tip.y < dip.y && dip.y < pip.y && pip.y < mcp.y;
}

function isFingerPointingLeftRight(hand, fingerName) {
    let tip = hand.keypoints.find(k => k.name === `${fingerName}_tip`);
    let mcp = hand.keypoints.find(k => k.name === `${fingerName}_mcp`);

    if (!tip || !mcp) return "unknown";

    return tip.x > mcp.x ? "left" : "right"; // Adjusted for mirrored video
}

function isFingerPointingUp(hand, fingerName) {
    let tip = hand.keypoints.find(k => k.name === `${fingerName}_tip`);
    let mcp = hand.keypoints.find(k => k.name === `${fingerName}_mcp`);

    if (!tip || !mcp) return "unknown";

    return tip.y < mcp.y ? "up" : "down"; // Adjusted for pointing up or down
}

function isHandOpen(hand) {
    // let fingers = ["thumb", "index_finger", "middle_finger", "ring_finger", "pinky"];

    // excluding thumb and pinky
    let fingers = ["index_finger", "middle_finger", "ring_finger"];

    // Check if all fingers are stretched
    return fingers.every(finger => isFingerStretched(hand, finger));
}