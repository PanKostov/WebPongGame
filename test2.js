let GameEngine = {
  setup: function () {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.canvas.width = 1600;
    this.canvas.height = 1200;

    this.canvas.style.width = this.canvas.width / 2 + "px";
    this.canvas.style.height = this.canvas.height / 2 + "px";

    this.player = Paddle.create.call(this, "left");
    this.paddle = Paddle.create.call(this, "right");
    this.puck = Puck.create.call(this);

    this.paddle.speed = 7;
    this.running = this.gameOver = false;
    this.playingNow = this.paddle;
    this.timer = this.round = 0;
    this.color = themeColors[0]; // Start with the first color

    PongUI.showMenu();
    PongUI.addListeners();
    loadBackgroundMusic("./background.mp3"); // Load the background music
  },

  showEndGameMenu: function (message) {
    PongUI.context.font = "45px Courier New";
    PongUI.context.fillStyle = this.color;

    PongUI.context.fillRect(
      PongUI.canvas.width / 2 - 350,
      PongUI.canvas.height / 2 - 48,
      700,
      100
    );

    PongUI.context.fillStyle = "#ffffff";
    PongUI.context.fillText(
      message,
      PongUI.canvas.width / 2,
      PongUI.canvas.height / 2 + 15
    );

    setTimeout(function () {
      Pong = Object.assign({}, GameEngine);
      Pong.setup();
    }, 3000);
  },

  showMenu: function () {
    PongUI.drawObjects();

    this.context.font = "50px Courier New";
    this.context.fillStyle = this.color;

    this.context.fillRect(
      this.canvas.width / 2 - 350,
      this.canvas.height / 2 - 48,
      700,
      100
    );

    this.context.fillStyle = "#ffffff";
    this.context.fillText(
      "Press any key to begin",
      this.canvas.width / 2,
      this.canvas.height / 2 + 15
    );
  },

  updateGameObjects: function () {
    if (!this.gameOver) {
      if (this.puck.x <= 0) PongUI.resetTurn.call(this, this.paddle, this.player);
      if (this.puck.x >= this.canvas.width - this.puck.width)
        PongUI.resetTurn.call(this, this.player, this.paddle);
      if (this.puck.y <= 0) this.puck.velocityY = MOVE.DOWN;
      if (this.puck.y >= this.canvas.height - this.puck.height)
        this.puck.velocityY = MOVE.UP;

      if (this.player.movement === MOVE.UP) this.player.y -= this.player.speed;
      else if (this.player.movement === MOVE.DOWN)
        this.player.y += this.player.speed;

      if (PongUI.isTurnDelayOver.call(this) && this.playingNow) {
        this.puck.velocityX =
          this.playingNow === this.player ? MOVE.LEFT : MOVE.RIGHT;
        this.puck.velocityY = [MOVE.UP, MOVE.DOWN][Math.round(Math.random())];
        this.puck.y =
          Math.floor(Math.random() * this.canvas.height - 200) + 200;
        this.playingNow = null;
      }

      if (this.player.y <= 0) this.player.y = 0;
      else if (this.player.y >= this.canvas.height - this.player.height)
        this.player.y = this.canvas.height - this.player.height;

      if (this.puck.velocityY === MOVE.UP) this.puck.y -= this.puck.speed / 1.5;
      else if (this.puck.velocityY === MOVE.DOWN)
        this.puck.y += this.puck.speed / 1.5;
      if (this.puck.velocityX === MOVE.LEFT) this.puck.x -= this.puck.speed;
      else if (this.puck.velocityX === MOVE.RIGHT)
        this.puck.x += this.puck.speed;

      if (this.paddle.y > this.puck.y - this.paddle.height / 2) {
        if (this.puck.velocityX === MOVE.RIGHT)
          this.paddle.y -= this.paddle.speed / 1.5;
        else this.paddle.y -= this.paddle.speed / 4;
      }
      if (this.paddle.y < this.puck.y - this.paddle.height / 2) {
        if (this.puck.velocityX === MOVE.RIGHT)
          this.paddle.y += this.paddle.speed / 1.5;
        else this.paddle.y += this.paddle.speed / 4;
      }

      if (this.paddle.y >= this.canvas.height - this.paddle.height)
        this.paddle.y = this.canvas.height - this.paddle.height;
      else if (this.paddle.y <= 0) this.paddle.y = 0;

      if (
        this.puck.x - this.puck.width <= this.player.x &&
        this.puck.x >= this.player.x - this.player.width
      ) {
        if (
          this.puck.y <= this.player.y + this.player.height &&
          this.puck.y + this.puck.height >= this.player.y
        ) {
          this.puck.x = this.player.x + this.puck.width;
          this.puck.velocityX = MOVE.RIGHT;
          
        }
      }

      if (
        this.puck.x - this.puck.width <= this.paddle.x &&
        this.puck.x >= this.paddle.x - this.paddle.width
      ) {
        if (
          this.puck.y <= this.paddle.y + this.paddle.height &&
          this.puck.y + this.puck.height >= this.paddle.y
        ) {
          this.puck.x = this.paddle.x - this.puck.width;
          this.puck.velocityX = MOVE.LEFT;
         
        }
      }

    }

    if (this.player.points === levels[this.round]) {
      this.updateRounds()
    } else if (this.paddle.points === levels[this.round]) {
      this.gameOver = true;
      setTimeout(function () {
        PongUI.showEndGameMenu("Game Over!");
      }, 1000);
    }
  },

  updateRounds: function () {
     if (!levels[this.round + 1]) {
        this.gameOver = true;
        setTimeout(function () {
          PongUI.showEndGameMenu("Winner!");
        }, 1000);
      } else {
        this.color = this.getNextRoundColor(this.round + 1);
        this.player.points = this.paddle.points = 0;
        this.player.speed += 0.5;
        this.paddle.speed += 1;
        this.puck.speed += 1; // Increase puck speed
        this.round += 1;
      }
  },

  drawObjects: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = this.color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = "#ffffff";

    this.context.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    this.context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

    if (PongUI.isTurnDelayOver.call(this)) {
      this.context.fillRect(
        this.puck.x,
        this.puck.y,
        this.puck.width,
        this.puck.height
      );
    }

    this.context.beginPath();
    this.context.setLineDash([7, 15]);
    this.context.moveTo(this.canvas.width / 2, this.canvas.height - 140);
    this.context.lineTo(this.canvas.width / 2, 140);
    this.context.lineWidth = 10;
    this.context.strokeStyle = "#ffffff";
    this.context.stroke();

    this.context.font = "100px Courier New";
    this.context.textAlign = "center";

    this.context.fillText(
      this.player.points.toString(),
      this.canvas.width / 2 - 300,
      200
    );

    this.context.fillText(
      this.paddle.points.toString(),
      this.canvas.width / 2 + 300,
      200
    );

    this.context.font = "30px Courier New";

    this.context.fillText(
      "Round " + (PongUI.round + 1),
      this.canvas.width / 2,
      35
    );

    this.context.font = "40px Courier";

    this.context.fillText(
      levels[PongUI.round] ? levels[PongUI.round] : levels[PongUI.round - 1],
      this.canvas.width / 2,
      100
    );
  },

  gameLoop: function () {
    PongUI.updateGameObjects();
    PongUI.drawObjects();

    if (!PongUI.gameOver) requestAnimationFrame(PongUI.gameLoop);
  },

  addListeners: function () {
    document.addEventListener("keydown", function (event) {
      if (PongUI.running === false) {
        PongUI.running = true;
        window.requestAnimationFrame(PongUI.gameLoop);
        playBackgroundMusic(); // Start playing background music when the game starts
      }

      if (event.keyCode === 38 || event.keyCode === 87)
        PongUI.player.movement = MOVE.UP;

      if (event.keyCode === 40 || event.keyCode === 83)
        PongUI.player.movement = MOVE.DOWN;
    });

    document.addEventListener("keyup", function (event) {
      PongUI.player.movement = MOVE.STILL;
    });
  },

  resetTurn: function (winner, loser) {
    this.puck = Puck.create.call(this, this.puck.speed + 1); // Increase puck speed
    this.playingNow = loser;
    this.timer = new Date().getTime();

    winner.points++;
  },

  isTurnDelayOver: function () {
    return new Date().getTime() - this.timer >= 1000;
  },

  getNextRoundColor: function (round) {
    let newColor = themeColors[round];
    return newColor;
  },
};

// Global Settings
let MOVE = {
  STILL: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

// Levels indicate the points required to win each round
let levels = [5, 4, 3, 2, 1];

// Color gradient from light green to dark green
let themeColors = ["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"];

// Audio
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let backgroundMusicBuffer;

// Function to load and decode the audio file
function loadBackgroundMusic(url) {
  fetch(url)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      backgroundMusicBuffer = audioBuffer;
    })
    .catch((e) => console.error("Error with decoding audio data", e));
}

// Function to play the background music in a loop
function playBackgroundMusic() {
  if (backgroundMusicBuffer) {
    let source = audioCtx.createBufferSource();
    source.buffer = backgroundMusicBuffer;
    source.loop = true;
    source.connect(audioCtx.destination);
    source.start(0);
  }
}

// The puck object (The square that bounces around)
let Puck = {
  create: function (initialSpeed) {
    return {
      width: 18,
      height: 18,
      x: this.canvas.width / 2 - 9,
      y: this.canvas.height / 2 - 9,
      velocityX: MOVE.STILL,
      velocityY: MOVE.STILL,
      speed: initialSpeed || 10,
    };
  },
};

// The paddle object (The bars that move up and down)
let Paddle = {
  create: function (position) {
    return {
      width: 18,
      height: 180,
      x: position === "left" ? 150 : this.canvas.width - 150,
      y: this.canvas.height / 2 - 35,
      points: 0,
      movement: MOVE.STILL,
      speed: 8,
    };
  },
};

let PongUI = Object.assign({}, GameEngine);
PongUI.setup();
