// Global Settings
var MOVE = {
  STILL: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

// Levels indicate the points required to win each round
var levels = [5, 5, 3, 3, 2];

// Color gradient from light green to dark green
var themeColors = ["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"];

//Audio
var audioCtx = new AudioContext();

// The puck object (The square that bounces around)
var Puck = {
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
var Paddle = {
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

var GameEngine = {
  setup: function () {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");

    this.canvas.width = 1400;
    this.canvas.height = 1000;

    this.canvas.style.width = this.canvas.width / 2 + "px";
    this.canvas.style.height = this.canvas.height / 2 + "px";

    this.player = Paddle.create.call(this, "left");
    this.ai = Paddle.create.call(this, "right");
    this.puck = Puck.create.call(this);

    this.ai.speed = 7;
    this.running = this.gameOver = false;
    this.turn = this.ai;
    this.timer = this.round = 0;
    this.color = themeColors[0]; // Start with the first color

    PongUI.showMenu();
    PongUI.addListeners();
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
      if (this.puck.x <= 0) PongUI.resetTurn.call(this, this.ai, this.player);
      if (this.puck.x >= this.canvas.width - this.puck.width)
        PongUI.resetTurn.call(this, this.player, this.ai);
      if (this.puck.y <= 0) this.puck.velocityY = MOVE.DOWN;
      if (this.puck.y >= this.canvas.height - this.puck.height)
        this.puck.velocityY = MOVE.UP;

      if (this.player.movement === MOVE.UP) this.player.y -= this.player.speed;
      else if (this.player.movement === MOVE.DOWN)
        this.player.y += this.player.speed;

      if (PongUI.isTurnDelayOver.call(this) && this.turn) {
        this.puck.velocityX =
          this.turn === this.player ? MOVE.LEFT : MOVE.RIGHT;
        this.puck.velocityY = [MOVE.UP, MOVE.DOWN][Math.round(Math.random())];
        this.puck.y =
          Math.floor(Math.random() * this.canvas.height - 200) + 200;
        this.turn = null;
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

      if (this.ai.y > this.puck.y - this.ai.height / 2) {
        if (this.puck.velocityX === MOVE.RIGHT)
          this.ai.y -= this.ai.speed / 1.5;
        else this.ai.y -= this.ai.speed / 4;
      }
      if (this.ai.y < this.puck.y - this.ai.height / 2) {
        if (this.puck.velocityX === MOVE.RIGHT)
          this.ai.y += this.ai.speed / 1.5;
        else this.ai.y += this.ai.speed / 4;
      }

      if (this.ai.y >= this.canvas.height - this.ai.height)
        this.ai.y = this.canvas.height - this.ai.height;
      else if (this.ai.y <= 0) this.ai.y = 0;

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
        this.puck.x - this.puck.width <= this.ai.x &&
        this.puck.x >= this.ai.x - this.ai.width
      ) {
        if (
          this.puck.y <= this.ai.y + this.ai.height &&
          this.puck.y + this.puck.height >= this.ai.y
        ) {
          this.puck.x = this.ai.x - this.puck.width;
          this.puck.velocityX = MOVE.LEFT;
        }
      }
    }

    if (this.player.points === levels[this.round]) {
      if (!levels[this.round + 1]) {
        this.gameOver = true;
        setTimeout(function () {
          PongUI.showEndGameMenu("Winner!");
        }, 1000);
      } else {
        this.color = this.getNextRoundColor();
        this.player.points = this.ai.points = 0;
        this.player.speed += 0.5;
        this.ai.speed += 1;
        this.puck.speed += 1; // Increase puck speed
        this.round += 1;
      }
    } else if (this.ai.points === levels[this.round]) {
      this.gameOver = true;
      setTimeout(function () {
        PongUI.showEndGameMenu("Game Over!");
      }, 1000);
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

    this.context.fillRect(this.ai.x, this.ai.y, this.ai.width, this.ai.height);

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
      this.ai.points.toString(),
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
    this.turn = loser;
    this.timer = new Date().getTime();

    winner.points++;
  },

  isTurnDelayOver: function () {
    return new Date().getTime() - this.timer >= 1000;
  },

  getNextRoundColor: function () {
    var newColor = themeColors[Math.floor(Math.random() * themeColors.length)];
    if (newColor === this.color) return PongUI.getNextRoundColor();
    return newColor;
  },
};

var PongUI = Object.assign({}, GameEngine);
PongUI.setup();
