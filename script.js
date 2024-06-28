// Global Settings
var MOVE = {
  STILL: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

var levels = [5, 5, 3, 3, 2];
var themeColors = ["#1abc9c", "#27ae60", "#2ecc71", "#16a085", "#1e824c"];

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
    this.color = "#1abc9c";

    PongUI.showMenu();
    PongUI.addListeners();
  },

  showEndGameMenu: function (message) {
    // Change the canvas font size and color
    PongUI.context.font = "45px Courier New";
    PongUI.context.fillStyle = this.color;

    // Draw the rectangle behind the 'Press any key to begin' text.
    PongUI.context.fillRect(
      PongUI.canvas.width / 2 - 350,
      PongUI.canvas.height / 2 - 48,
      700,
      100
    );

    // Change the canvas color;
    PongUI.context.fillStyle = "#ffffff";

    // Draw the end game menu text ('Game Over' and 'Winner')
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
    // Draw all the Pong objects in their current state
    PongUI.drawObjects();

    // Change the canvas font size and color
    this.context.font = "50px Courier New";
    this.context.fillStyle = this.color;

    // Draw the rectangle behind the 'Press any key to begin' text.
    this.context.fillRect(
      this.canvas.width / 2 - 350,
      this.canvas.height / 2 - 48,
      700,
      100
    );

    // Change the canvas color;
    this.context.fillStyle = "#ffffff";

    // Draw the 'press any key to begin' text
    this.context.fillText(
      "Press any key to begin",
      this.canvas.width / 2,
      this.canvas.height / 2 + 15
    );
  },

  // Update all objects (move the player, ai, puck, increment the score, etc.)
  updateGameObjects: function () {
    if (!this.gameOver) {
      // If the puck collides with the bound limits - correct the x and y coords.
      if (this.puck.x <= 0) PongUI.resetTurn.call(this, this.ai, this.player);
      if (this.puck.x >= this.canvas.width - this.puck.width)
        PongUI.resetTurn.call(this, this.player, this.ai);
      if (this.puck.y <= 0) this.puck.velocityY = MOVE.DOWN;
      if (this.puck.y >= this.canvas.height - this.puck.height)
        this.puck.velocityY = MOVE.UP;

      // Move player if they player.move value was updated by a keyboard event
      if (this.player.movement === MOVE.UP) this.player.y -= this.player.speed;
      else if (this.player.movement === MOVE.DOWN)
        this.player.y += this.player.speed;

      // On new serve (start of each turn) move the puck to the correct side
      // and randomize the direction to add some challenge.
      if (PongUI.isTurnDelayOver.call(this) && this.turn) {
        this.puck.velocityX =
          this.turn === this.player ? MOVE.LEFT : MOVE.RIGHT;
        this.puck.velocityY = [MOVE.UP, MOVE.DOWN][Math.round(Math.random())];
        this.puck.y =
          Math.floor(Math.random() * this.canvas.height - 200) + 200;
        this.turn = null;
      }

      // If the player collides with the bound limits, update the x and y coords.
      if (this.player.y <= 0) this.player.y = 0;
      else if (this.player.y >= this.canvas.height - this.player.height)
        this.player.y = this.canvas.height - this.player.height;

      // Move puck in intended direction based on velocityY and velocityX values
      if (this.puck.velocityY === MOVE.UP) this.puck.y -= this.puck.speed / 1.5;
      else if (this.puck.velocityY === MOVE.DOWN)
        this.puck.y += this.puck.speed / 1.5;
      if (this.puck.velocityX === MOVE.LEFT) this.puck.x -= this.puck.speed;
      else if (this.puck.velocityX === MOVE.RIGHT)
        this.puck.x += this.puck.speed;

      // Handle ai (AI) UP and DOWN movement
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

      // Handle ai (AI) wall collision
      if (this.ai.y >= this.canvas.height - this.ai.height)
        this.ai.y = this.canvas.height - this.ai.height;
      else if (this.ai.y <= 0) this.ai.y = 0;

      // Handle Player-Puck collisions
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

      // Handle ai-puck collision
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

    // Handle the end of round transition
    // Check to see if the player won the round.
    if (this.player.points === levels[this.round]) {
      // Check to see if there are any more levels left and display the victory screen if
      // there are not.
      if (!levels[this.round + 1]) {
        this.gameOver = true;
        setTimeout(function () {
          PongUI.showEndGameMenu("Winner!");
        }, 1000);
      } else {
        // If there is another round, reset all the values and increment the round number.
        this.color = this.getNextRoundColor();
        this.player.points = this.ai.points = 0;
        this.player.speed += 0.5;
        this.ai.speed += 1;
        this.puck.speed += 1;
        this.round += 1;
      }
    }
    // Check to see if the ai has won the round.
    else if (this.ai.points === levels[this.round]) {
      this.gameOver = true;
      setTimeout(function () {
        PongUI.showEndGameMenu("Game Over!");
      }, 1000);
    }
  },

  // Draw the objects to the canvas element
  drawObjects: function () {
    // Clear the Canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set the fill style to black
    this.context.fillStyle = this.color;

    // Draw the background
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set the fill style to white (For the paddles and the puck)
    this.context.fillStyle = "#ffffff";

    // Draw the Player
    this.context.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    // Draw the Ai
    this.context.fillRect(this.ai.x, this.ai.y, this.ai.width, this.ai.height);

    // Draw the Puck
    if (PongUI.isTurnDelayOver.call(this)) {
      this.context.fillRect(
        this.puck.x,
        this.puck.y,
        this.puck.width,
        this.puck.height
      );
    }

    // Draw the net (Line in the middle)
    this.context.beginPath();
    this.context.setLineDash([7, 15]);
    this.context.moveTo(this.canvas.width / 2, this.canvas.height - 140);
    this.context.lineTo(this.canvas.width / 2, 140);
    this.context.lineWidth = 10;
    this.context.strokeStyle = "#ffffff";
    this.context.stroke();

    // Set the default canvas font and align it to the center
    this.context.font = "100px Courier New";
    this.context.textAlign = "center";

    // Draw the players score (left)
    this.context.fillText(
      this.player.points.toString(),
      this.canvas.width / 2 - 300,
      200
    );

    // Draw the ai score (right)
    this.context.fillText(
      this.ai.points.toString(),
      this.canvas.width / 2 + 300,
      200
    );

    // Change the font size for the center score text
    this.context.font = "30px Courier New";

    // Draw the current round number
    this.context.fillText(
      "Round " + (PongUI.round + 1),
      this.canvas.width / 2,
      35
    );

    // Change the font size for the center score value
    this.context.font = "40px Courier";

    // Draw the level target score
    this.context.fillText(
      levels[PongUI.round] ? levels[PongUI.round] : levels[PongUI.round - 1],
      this.canvas.width / 2,
      100
    );
  },

  gameLoop: function () {
    PongUI.updateGameObjects();
    PongUI.drawObjects();

    // If the game is not over, draw the next frame.
    if (!PongUI.gameOver) requestAnimationFrame(PongUI.gameLoop);
  },

  addListeners: function () {
    document.addEventListener("keydown", function (event) {
      // Handle the 'Press any key to begin' function and start the game.
      if (PongUI.running === false) {
        PongUI.running = true;
        window.requestAnimationFrame(PongUI.gameLoop);
      }

      // Handle up arrow and w key events
      if (event.keyCode === 38 || event.keyCode === 87)
        PongUI.player.movement = MOVE.UP;

      // Handle down arrow and s key events
      if (event.keyCode === 40 || event.keyCode === 83)
        PongUI.player.movement = MOVE.DOWN;
    });

    // Stop the player from moving when there are no keys being pressed.
    document.addEventListener("keyup", function (event) {
      PongUI.player.movement = MOVE.STILL;
    });
  },

  // Reset the puck location, the player turns and set a delay before the next round begins.
  resetTurn: function (winner, loser) {
    this.puck = Puck.create.call(this, this.puck.speed);
    this.turn = loser;
    this.timer = new Date().getTime();

    winner.points++;
  },

  // Wait for a delay to have passed after each turn.
  isTurnDelayOver: function () {
    return new Date().getTime() - this.timer >= 1000;
  },

  // Select a random color as the background of each level.
  getNextRoundColor: function () {
    var newColor = themeColors[Math.floor(Math.random() * themeColors.length)];
    if (newColor === this.color) return PongUI.getNextRoundColor();
    return newColor;
  },
};

var PongUI = Object.assign({}, GameEngine);
PongUI.setup();
