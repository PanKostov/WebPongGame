"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const paddle_1 = require("./paddle");
const puck_1 = require("./puck");
class GameEngine {
    constructor() {
        this.running = false;
        this.gameOver = false;
        this.turn = null;
        this.timer = 0;
        this.round = 0;
        this.levels = [5, 5, 3, 3, 2];
        this.themeColors = ["#a8e6cf", "#dcedc1", "#ffd3b6", "#ffaaa5", "#ff8b94"];
        this.canvas = document.querySelector("canvas");
        this.context = this.canvas.getContext("2d");
        this.audioCtx = new AudioContext();
        this.canvas.width = 1400;
        this.canvas.height = 1000;
        this.canvas.style.width = this.canvas.width / 2 + "px";
        this.canvas.style.height = this.canvas.height / 2 + "px";
        this.color = this.themeColors[0]; // Initialize color
        this.setup(); // Initialize the game
        this.addListeners();
    }
    setup() {
        this.player = (0, paddle_1.createPaddle)("left", this.canvas);
        this.ai = (0, paddle_1.createPaddle)("right", this.canvas);
        this.puck = (0, puck_1.createPuck)(this.canvas);
        this.ai.speed = 7;
        this.running = this.gameOver = false;
        this.turn = this.ai;
        this.timer = this.round = 0;
        this.color = this.themeColors[0]; // Start with the first color
        this.showMenu();
    }
    showEndGameMenu(message) {
        this.context.font = "45px Courier New";
        this.context.fillStyle = this.color;
        this.context.fillRect(this.canvas.width / 2 - 350, this.canvas.height / 2 - 48, 700, 100);
        this.context.fillStyle = "#ffffff";
        this.context.fillText(message, this.canvas.width / 2, this.canvas.height / 2 + 15);
        setTimeout(() => {
            this.setup();
        }, 3000);
    }
    showMenu() {
        this.drawObjects();
        this.context.font = "50px Courier New";
        this.context.fillStyle = this.color;
        this.context.fillRect(this.canvas.width / 2 - 350, this.canvas.height / 2 - 48, 700, 100);
        this.context.fillStyle = "#ffffff";
        this.context.fillText("Press any key to begin", this.canvas.width / 2, this.canvas.height / 2 + 15);
    }
    updateGameObjects() {
        if (!this.gameOver) {
            if (this.puck.x <= 0)
                this.resetTurn(this.ai, this.player);
            if (this.puck.x >= this.canvas.width - this.puck.width)
                this.resetTurn(this.player, this.ai);
            if (this.puck.y <= 0)
                this.puck.velocityY = types_1.Move.DOWN;
            if (this.puck.y >= this.canvas.height - this.puck.height)
                this.puck.velocityY = types_1.Move.UP;
            if (this.player.movement === types_1.Move.UP)
                this.player.y -= this.player.speed;
            else if (this.player.movement === types_1.Move.DOWN)
                this.player.y += this.player.speed;
            if (this.isTurnDelayOver() && this.turn) {
                this.puck.velocityX =
                    this.turn === this.player ? types_1.Move.LEFT : types_1.Move.RIGHT;
                this.puck.velocityY = [types_1.Move.UP, types_1.Move.DOWN][Math.round(Math.random())];
                this.puck.y =
                    Math.floor(Math.random() * (this.canvas.height - 200)) + 200;
                this.turn = null;
            }
            if (this.player.y <= 0)
                this.player.y = 0;
            else if (this.player.y >= this.canvas.height - this.player.height)
                this.player.y = this.canvas.height - this.player.height;
            if (this.puck.velocityY === types_1.Move.UP)
                this.puck.y -= this.puck.speed / 1.5;
            else if (this.puck.velocityY === types_1.Move.DOWN)
                this.puck.y += this.puck.speed / 1.5;
            if (this.puck.velocityX === types_1.Move.LEFT)
                this.puck.x -= this.puck.speed;
            else if (this.puck.velocityX === types_1.Move.RIGHT)
                this.puck.x += this.puck.speed;
            if (this.ai.y > this.puck.y - this.ai.height / 2) {
                if (this.puck.velocityX === types_1.Move.RIGHT)
                    this.ai.y -= this.ai.speed / 1.5;
                else
                    this.ai.y -= this.ai.speed / 4;
            }
            if (this.ai.y < this.puck.y - this.ai.height / 2) {
                if (this.puck.velocityX === types_1.Move.RIGHT)
                    this.ai.y += this.ai.speed / 1.5;
                else
                    this.ai.y += this.ai.speed / 4;
            }
            if (this.ai.y >= this.canvas.height - this.ai.height)
                this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0)
                this.ai.y = 0;
            if (this.puck.x - this.puck.width <= this.player.x &&
                this.puck.x >= this.player.x - this.player.width) {
                if (this.puck.y <= this.player.y + this.player.height &&
                    this.puck.y + this.puck.height >= this.player.y) {
                    this.puck.x = this.player.x + this.puck.width;
                    this.puck.velocityX = types_1.Move.RIGHT;
                }
            }
            if (this.puck.x - this.puck.width <= this.ai.x &&
                this.puck.x >= this.ai.x - this.ai.width) {
                if (this.puck.y <= this.ai.y + this.ai.height &&
                    this.puck.y + this.puck.height >= this.ai.y) {
                    this.puck.x = this.ai.x - this.puck.width;
                    this.puck.velocityX = types_1.Move.LEFT;
                }
            }
        }
        if (this.player.points === this.levels[this.round]) {
            if (!this.levels[this.round + 1]) {
                this.gameOver = true;
                setTimeout(() => {
                    this.showEndGameMenu("Winner!");
                }, 1000);
            }
            else {
                this.color = this.getNextRoundColor();
                this.player.points = this.ai.points = 0;
                this.player.speed += 0.5;
                this.ai.speed += 1;
                this.puck.speed += 1; // Increase puck speed
                this.round += 1;
            }
        }
        else if (this.ai.points === this.levels[this.round]) {
            this.gameOver = true;
            setTimeout(() => {
                this.showEndGameMenu("Game Over!");
            }, 1000);
        }
    }
    drawObjects() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#ffffff";
        this.context.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        this.context.fillRect(this.ai.x, this.ai.y, this.ai.width, this.ai.height);
        if (this.isTurnDelayOver()) {
            this.context.fillRect(this.puck.x, this.puck.y, this.puck.width, this.puck.height);
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
        this.context.fillText(this.player.points.toString(), this.canvas.width / 2 - 300, 200);
        this.context.fillText(this.ai.points.toString(), this.canvas.width / 2 + 300, 200);
        this.context.font = "30px Courier New";
        this.context.fillText("Round " + (this.round + 1), this.canvas.width / 2, 35);
        this.context.font = "40px Courier";
        this.context.fillText(this.levels[this.round]
            ? this.levels[this.round].toString()
            : this.levels[this.round - 1].toString(), this.canvas.width / 2, 100);
    }
    gameLoop() {
        this.updateGameObjects();
        this.drawObjects();
        if (!this.gameOver)
            requestAnimationFrame(() => this.gameLoop());
    }
    addListeners() {
        document.addEventListener("keydown", (event) => {
            if (this.running === false) {
                this.running = true;
                window.requestAnimationFrame(() => this.gameLoop());
            }
            if (event.key === "ArrowUp" || event.key === "w")
                this.player.movement = types_1.Move.UP;
            if (event.key === "ArrowDown" || event.key === "s")
                this.player.movement = types_1.Move.DOWN;
        });
        document.addEventListener("keyup", () => {
            this.player.movement = types_1.Move.STILL;
        });
    }
    resetTurn(winner, loser) {
        this.puck = (0, puck_1.createPuck)(this.canvas, this.puck.speed + 1); // Increase puck speed
        this.turn = loser;
        this.timer = new Date().getTime();
        winner.points++;
    }
    isTurnDelayOver() {
        return new Date().getTime() - this.timer >= 1000;
    }
    getNextRoundColor() {
        const newColor = this.themeColors[Math.floor(Math.random() * this.themeColors.length)];
        if (newColor === this.color)
            return this.getNextRoundColor();
        return newColor;
    }
}
exports.default = GameEngine;
