//global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables

var pattern = [];
var progress = 0; //index of pattern[]
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;


function startGame() {
    for (let i = 0; i < 10; i++) pattern[i] = Math.round(Math.random() * 5);
    //initialize game variables
    progress = 0;
    gamePlaying = true;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
}

function stopGame() {
    gamePlaying = false;
    // swap the Start and Stop buttons
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

function loseGame() {
    stopGame();
    alert("Game Over. You lost.");
}

function winGame() {
    stopGame();
    alert("Game Over. You won!");
}

function lightButton(btn) {
    document.getElementById("button" + btn).classList.add("lit")
}

function clearButton(btn) {
    document.getElementById("button" + btn).classList.remove("lit")
}


function playSingleClue(btn) {
    if (gamePlaying) {
        lightButton(btn);
        playTone(btn, clueHoldTime);
        setTimeout(clearButton, clueHoldTime, btn);
    }
}

function playClueSequence() {
    guessCounter = 0
    let delay = nextClueWaitTime; //set delay to initial wait time  
    for (let i = 0; i <= progress; i++) { // for each clue that is revealed so far
        console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
        setTimeout(playSingleClue, delay, pattern[i]) // set a timeout to play that clue
        delay += clueHoldTime
        delay += cluePauseTime;
    }
}

function guess(btn) {
    console.log("user guessed: " + btn);
    if (!gamePlaying) {
        return;
    }

    if (pattern[guessCounter] == btn) {
        //Guess was correct!
        if (guessCounter == progress) {
            if (progress == pattern.length - 1) {
                //GAME OVER: WIN!
                winGame();
            } else {
                //Pattern correct. Add next segment
                progress++;
                playClueSequence();
            }
        } else {
            //so far so good... check the next guess
            guessCounter++;
        }
    } else {
        //Guess was incorrect
        //GAME OVER: LOSE!
        loseGame();
    }
}

// Sound Synthesis Functions
const freqMap = {
    1: 261.6,
    2: 329.6,
    3: 392,
    4: 466.2,
    5: 423
}

function playTone(btn, len) {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    tonePlaying = true
    setTimeout(function() {
        stopTone()
    }, len)
}

function startTone(btn) {
    if (!tonePlaying) {
        o.frequency.value = freqMap[btn]
        g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
        tonePlaying = true
    }
}

function stopTone() {
    g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)