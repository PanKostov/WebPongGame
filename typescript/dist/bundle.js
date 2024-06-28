/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/paddle.ts":
/*!***********************!*\
  !*** ./src/paddle.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createPaddle = void 0;
const types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
function createPaddle(position, canvas) {
    return {
        width: 18,
        height: 180,
        x: position === "left" ? 150 : canvas.width - 150,
        y: canvas.height / 2 - 35,
        points: 0,
        movement: types_1.Move.STILL,
        speed: 8,
    };
}
exports.createPaddle = createPaddle;


/***/ }),

/***/ "./src/puck.ts":
/*!*********************!*\
  !*** ./src/puck.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createPuck = void 0;
const types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
function createPuck(canvas, initialSpeed = 10) {
    return {
        width: 18,
        height: 18,
        x: canvas.width / 2 - 9,
        y: canvas.height / 2 - 9,
        velocityX: types_1.Move.STILL,
        velocityY: types_1.Move.STILL,
        speed: initialSpeed,
    };
}
exports.createPuck = createPuck;


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Move = void 0;
var Move;
(function (Move) {
    Move[Move["STILL"] = 0] = "STILL";
    Move[Move["UP"] = 1] = "UP";
    Move[Move["DOWN"] = 2] = "DOWN";
    Move[Move["LEFT"] = 3] = "LEFT";
    Move[Move["RIGHT"] = 4] = "RIGHT";
})(Move = exports.Move || (exports.Move = {}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const types_1 = __webpack_require__(/*! ./types */ "./src/types.ts");
const paddle_1 = __webpack_require__(/*! ./paddle */ "./src/paddle.ts");
const puck_1 = __webpack_require__(/*! ./puck */ "./src/puck.ts");
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
exports["default"] = GameEngine;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxvQkFBb0I7QUFDcEIsZ0JBQWdCLG1CQUFPLENBQUMsK0JBQVM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7Ozs7Ozs7Ozs7QUNmUDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBa0I7QUFDbEIsZ0JBQWdCLG1CQUFPLENBQUMsK0JBQVM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjs7Ozs7Ozs7Ozs7QUNmTDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDBCQUEwQixZQUFZLEtBQUs7Ozs7Ozs7VUNWNUM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxnQkFBZ0IsbUJBQU8sQ0FBQywrQkFBUztBQUNqQyxpQkFBaUIsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNuQyxlQUFlLG1CQUFPLENBQUMsNkJBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsOEVBQThFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBZSIsInNvdXJjZXMiOlsid2VicGFjazovL3BvbmctZ2FtZS8uL3NyYy9wYWRkbGUudHMiLCJ3ZWJwYWNrOi8vcG9uZy1nYW1lLy4vc3JjL3B1Y2sudHMiLCJ3ZWJwYWNrOi8vcG9uZy1nYW1lLy4vc3JjL3R5cGVzLnRzIiwid2VicGFjazovL3BvbmctZ2FtZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9wb25nLWdhbWUvLi9zcmMvZ2FtZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlUGFkZGxlID0gdm9pZCAwO1xuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuZnVuY3Rpb24gY3JlYXRlUGFkZGxlKHBvc2l0aW9uLCBjYW52YXMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogMTgsXG4gICAgICAgIGhlaWdodDogMTgwLFxuICAgICAgICB4OiBwb3NpdGlvbiA9PT0gXCJsZWZ0XCIgPyAxNTAgOiBjYW52YXMud2lkdGggLSAxNTAsXG4gICAgICAgIHk6IGNhbnZhcy5oZWlnaHQgLyAyIC0gMzUsXG4gICAgICAgIHBvaW50czogMCxcbiAgICAgICAgbW92ZW1lbnQ6IHR5cGVzXzEuTW92ZS5TVElMTCxcbiAgICAgICAgc3BlZWQ6IDgsXG4gICAgfTtcbn1cbmV4cG9ydHMuY3JlYXRlUGFkZGxlID0gY3JlYXRlUGFkZGxlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZVB1Y2sgPSB2b2lkIDA7XG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5mdW5jdGlvbiBjcmVhdGVQdWNrKGNhbnZhcywgaW5pdGlhbFNwZWVkID0gMTApIHtcbiAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogMTgsXG4gICAgICAgIGhlaWdodDogMTgsXG4gICAgICAgIHg6IGNhbnZhcy53aWR0aCAvIDIgLSA5LFxuICAgICAgICB5OiBjYW52YXMuaGVpZ2h0IC8gMiAtIDksXG4gICAgICAgIHZlbG9jaXR5WDogdHlwZXNfMS5Nb3ZlLlNUSUxMLFxuICAgICAgICB2ZWxvY2l0eVk6IHR5cGVzXzEuTW92ZS5TVElMTCxcbiAgICAgICAgc3BlZWQ6IGluaXRpYWxTcGVlZCxcbiAgICB9O1xufVxuZXhwb3J0cy5jcmVhdGVQdWNrID0gY3JlYXRlUHVjaztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Nb3ZlID0gdm9pZCAwO1xudmFyIE1vdmU7XG4oZnVuY3Rpb24gKE1vdmUpIHtcbiAgICBNb3ZlW01vdmVbXCJTVElMTFwiXSA9IDBdID0gXCJTVElMTFwiO1xuICAgIE1vdmVbTW92ZVtcIlVQXCJdID0gMV0gPSBcIlVQXCI7XG4gICAgTW92ZVtNb3ZlW1wiRE9XTlwiXSA9IDJdID0gXCJET1dOXCI7XG4gICAgTW92ZVtNb3ZlW1wiTEVGVFwiXSA9IDNdID0gXCJMRUZUXCI7XG4gICAgTW92ZVtNb3ZlW1wiUklHSFRcIl0gPSA0XSA9IFwiUklHSFRcIjtcbn0pKE1vdmUgPSBleHBvcnRzLk1vdmUgfHwgKGV4cG9ydHMuTW92ZSA9IHt9KSk7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCB0eXBlc18xID0gcmVxdWlyZShcIi4vdHlwZXNcIik7XG5jb25zdCBwYWRkbGVfMSA9IHJlcXVpcmUoXCIuL3BhZGRsZVwiKTtcbmNvbnN0IHB1Y2tfMSA9IHJlcXVpcmUoXCIuL3B1Y2tcIik7XG5jbGFzcyBHYW1lRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50dXJuID0gbnVsbDtcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgICAgIHRoaXMucm91bmQgPSAwO1xuICAgICAgICB0aGlzLmxldmVscyA9IFs1LCA1LCAzLCAzLCAyXTtcbiAgICAgICAgdGhpcy50aGVtZUNvbG9ycyA9IFtcIiNhOGU2Y2ZcIiwgXCIjZGNlZGMxXCIsIFwiI2ZmZDNiNlwiLCBcIiNmZmFhYTVcIiwgXCIjZmY4Yjk0XCJdO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJjYW52YXNcIik7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdGhpcy5hdWRpb0N0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSAxNDAwO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSAxMDAwO1xuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IHRoaXMuY2FudmFzLndpZHRoIC8gMiArIFwicHhcIjtcbiAgICAgICAgdGhpcy5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMiArIFwicHhcIjtcbiAgICAgICAgdGhpcy5jb2xvciA9IHRoaXMudGhlbWVDb2xvcnNbMF07IC8vIEluaXRpYWxpemUgY29sb3JcbiAgICAgICAgdGhpcy5zZXR1cCgpOyAvLyBJbml0aWFsaXplIHRoZSBnYW1lXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXJzKCk7XG4gICAgfVxuICAgIHNldHVwKCkge1xuICAgICAgICB0aGlzLnBsYXllciA9ICgwLCBwYWRkbGVfMS5jcmVhdGVQYWRkbGUpKFwibGVmdFwiLCB0aGlzLmNhbnZhcyk7XG4gICAgICAgIHRoaXMuYWkgPSAoMCwgcGFkZGxlXzEuY3JlYXRlUGFkZGxlKShcInJpZ2h0XCIsIHRoaXMuY2FudmFzKTtcbiAgICAgICAgdGhpcy5wdWNrID0gKDAsIHB1Y2tfMS5jcmVhdGVQdWNrKSh0aGlzLmNhbnZhcyk7XG4gICAgICAgIHRoaXMuYWkuc3BlZWQgPSA3O1xuICAgICAgICB0aGlzLnJ1bm5pbmcgPSB0aGlzLmdhbWVPdmVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMudHVybiA9IHRoaXMuYWk7XG4gICAgICAgIHRoaXMudGltZXIgPSB0aGlzLnJvdW5kID0gMDtcbiAgICAgICAgdGhpcy5jb2xvciA9IHRoaXMudGhlbWVDb2xvcnNbMF07IC8vIFN0YXJ0IHdpdGggdGhlIGZpcnN0IGNvbG9yXG4gICAgICAgIHRoaXMuc2hvd01lbnUoKTtcbiAgICB9XG4gICAgc2hvd0VuZEdhbWVNZW51KG1lc3NhZ2UpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPSBcIjQ1cHggQ291cmllciBOZXdcIjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCh0aGlzLmNhbnZhcy53aWR0aCAvIDIgLSAzNTAsIHRoaXMuY2FudmFzLmhlaWdodCAvIDIgLSA0OCwgNzAwLCAxMDApO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCIjZmZmZmZmXCI7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChtZXNzYWdlLCB0aGlzLmNhbnZhcy53aWR0aCAvIDIsIHRoaXMuY2FudmFzLmhlaWdodCAvIDIgKyAxNSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXR1cCgpO1xuICAgICAgICB9LCAzMDAwKTtcbiAgICB9XG4gICAgc2hvd01lbnUoKSB7XG4gICAgICAgIHRoaXMuZHJhd09iamVjdHMoKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPSBcIjUwcHggQ291cmllciBOZXdcIjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCh0aGlzLmNhbnZhcy53aWR0aCAvIDIgLSAzNTAsIHRoaXMuY2FudmFzLmhlaWdodCAvIDIgLSA0OCwgNzAwLCAxMDApO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gXCIjZmZmZmZmXCI7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChcIlByZXNzIGFueSBrZXkgdG8gYmVnaW5cIiwgdGhpcy5jYW52YXMud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQgLyAyICsgMTUpO1xuICAgIH1cbiAgICB1cGRhdGVHYW1lT2JqZWN0cygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdhbWVPdmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wdWNrLnggPD0gMClcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0VHVybih0aGlzLmFpLCB0aGlzLnBsYXllcik7XG4gICAgICAgICAgICBpZiAodGhpcy5wdWNrLnggPj0gdGhpcy5jYW52YXMud2lkdGggLSB0aGlzLnB1Y2sud2lkdGgpXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFR1cm4odGhpcy5wbGF5ZXIsIHRoaXMuYWkpO1xuICAgICAgICAgICAgaWYgKHRoaXMucHVjay55IDw9IDApXG4gICAgICAgICAgICAgICAgdGhpcy5wdWNrLnZlbG9jaXR5WSA9IHR5cGVzXzEuTW92ZS5ET1dOO1xuICAgICAgICAgICAgaWYgKHRoaXMucHVjay55ID49IHRoaXMuY2FudmFzLmhlaWdodCAtIHRoaXMucHVjay5oZWlnaHQpXG4gICAgICAgICAgICAgICAgdGhpcy5wdWNrLnZlbG9jaXR5WSA9IHR5cGVzXzEuTW92ZS5VUDtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllci5tb3ZlbWVudCA9PT0gdHlwZXNfMS5Nb3ZlLlVQKVxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnkgLT0gdGhpcy5wbGF5ZXIuc3BlZWQ7XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnBsYXllci5tb3ZlbWVudCA9PT0gdHlwZXNfMS5Nb3ZlLkRPV04pXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIueSArPSB0aGlzLnBsYXllci5zcGVlZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVHVybkRlbGF5T3ZlcigpICYmIHRoaXMudHVybikge1xuICAgICAgICAgICAgICAgIHRoaXMucHVjay52ZWxvY2l0eVggPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnR1cm4gPT09IHRoaXMucGxheWVyID8gdHlwZXNfMS5Nb3ZlLkxFRlQgOiB0eXBlc18xLk1vdmUuUklHSFQ7XG4gICAgICAgICAgICAgICAgdGhpcy5wdWNrLnZlbG9jaXR5WSA9IFt0eXBlc18xLk1vdmUuVVAsIHR5cGVzXzEuTW92ZS5ET1dOXVtNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpXTtcbiAgICAgICAgICAgICAgICB0aGlzLnB1Y2sueSA9XG4gICAgICAgICAgICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICh0aGlzLmNhbnZhcy5oZWlnaHQgLSAyMDApKSArIDIwMDtcbiAgICAgICAgICAgICAgICB0aGlzLnR1cm4gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyLnkgPD0gMClcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci55ID0gMDtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucGxheWVyLnkgPj0gdGhpcy5jYW52YXMuaGVpZ2h0IC0gdGhpcy5wbGF5ZXIuaGVpZ2h0KVxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnkgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLSB0aGlzLnBsYXllci5oZWlnaHQ7XG4gICAgICAgICAgICBpZiAodGhpcy5wdWNrLnZlbG9jaXR5WSA9PT0gdHlwZXNfMS5Nb3ZlLlVQKVxuICAgICAgICAgICAgICAgIHRoaXMucHVjay55IC09IHRoaXMucHVjay5zcGVlZCAvIDEuNTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucHVjay52ZWxvY2l0eVkgPT09IHR5cGVzXzEuTW92ZS5ET1dOKVxuICAgICAgICAgICAgICAgIHRoaXMucHVjay55ICs9IHRoaXMucHVjay5zcGVlZCAvIDEuNTtcbiAgICAgICAgICAgIGlmICh0aGlzLnB1Y2sudmVsb2NpdHlYID09PSB0eXBlc18xLk1vdmUuTEVGVClcbiAgICAgICAgICAgICAgICB0aGlzLnB1Y2sueCAtPSB0aGlzLnB1Y2suc3BlZWQ7XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLnB1Y2sudmVsb2NpdHlYID09PSB0eXBlc18xLk1vdmUuUklHSFQpXG4gICAgICAgICAgICAgICAgdGhpcy5wdWNrLnggKz0gdGhpcy5wdWNrLnNwZWVkO1xuICAgICAgICAgICAgaWYgKHRoaXMuYWkueSA+IHRoaXMucHVjay55IC0gdGhpcy5haS5oZWlnaHQgLyAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHVjay52ZWxvY2l0eVggPT09IHR5cGVzXzEuTW92ZS5SSUdIVClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5haS55IC09IHRoaXMuYWkuc3BlZWQgLyAxLjU7XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFpLnkgLT0gdGhpcy5haS5zcGVlZCAvIDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5haS55IDwgdGhpcy5wdWNrLnkgLSB0aGlzLmFpLmhlaWdodCAvIDIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wdWNrLnZlbG9jaXR5WCA9PT0gdHlwZXNfMS5Nb3ZlLlJJR0hUKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFpLnkgKz0gdGhpcy5haS5zcGVlZCAvIDEuNTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWkueSArPSB0aGlzLmFpLnNwZWVkIC8gNDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmFpLnkgPj0gdGhpcy5jYW52YXMuaGVpZ2h0IC0gdGhpcy5haS5oZWlnaHQpXG4gICAgICAgICAgICAgICAgdGhpcy5haS55ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC0gdGhpcy5haS5oZWlnaHQ7XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmFpLnkgPD0gMClcbiAgICAgICAgICAgICAgICB0aGlzLmFpLnkgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMucHVjay54IC0gdGhpcy5wdWNrLndpZHRoIDw9IHRoaXMucGxheWVyLnggJiZcbiAgICAgICAgICAgICAgICB0aGlzLnB1Y2sueCA+PSB0aGlzLnBsYXllci54IC0gdGhpcy5wbGF5ZXIud2lkdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wdWNrLnkgPD0gdGhpcy5wbGF5ZXIueSArIHRoaXMucGxheWVyLmhlaWdodCAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1Y2sueSArIHRoaXMucHVjay5oZWlnaHQgPj0gdGhpcy5wbGF5ZXIueSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1Y2sueCA9IHRoaXMucGxheWVyLnggKyB0aGlzLnB1Y2sud2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVjay52ZWxvY2l0eVggPSB0eXBlc18xLk1vdmUuUklHSFQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucHVjay54IC0gdGhpcy5wdWNrLndpZHRoIDw9IHRoaXMuYWkueCAmJlxuICAgICAgICAgICAgICAgIHRoaXMucHVjay54ID49IHRoaXMuYWkueCAtIHRoaXMuYWkud2lkdGgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wdWNrLnkgPD0gdGhpcy5haS55ICsgdGhpcy5haS5oZWlnaHQgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdWNrLnkgKyB0aGlzLnB1Y2suaGVpZ2h0ID49IHRoaXMuYWkueSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1Y2sueCA9IHRoaXMuYWkueCAtIHRoaXMucHVjay53aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wdWNrLnZlbG9jaXR5WCA9IHR5cGVzXzEuTW92ZS5MRUZUO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wbGF5ZXIucG9pbnRzID09PSB0aGlzLmxldmVsc1t0aGlzLnJvdW5kXSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxldmVsc1t0aGlzLnJvdW5kICsgMV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVPdmVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93RW5kR2FtZU1lbnUoXCJXaW5uZXIhXCIpO1xuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvciA9IHRoaXMuZ2V0TmV4dFJvdW5kQ29sb3IoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5wb2ludHMgPSB0aGlzLmFpLnBvaW50cyA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXIuc3BlZWQgKz0gMC41O1xuICAgICAgICAgICAgICAgIHRoaXMuYWkuc3BlZWQgKz0gMTtcbiAgICAgICAgICAgICAgICB0aGlzLnB1Y2suc3BlZWQgKz0gMTsgLy8gSW5jcmVhc2UgcHVjayBzcGVlZFxuICAgICAgICAgICAgICAgIHRoaXMucm91bmQgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmFpLnBvaW50cyA9PT0gdGhpcy5sZXZlbHNbdGhpcy5yb3VuZF0pIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RW5kR2FtZU1lbnUoXCJHYW1lIE92ZXIhXCIpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZHJhd09iamVjdHMoKSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBcIiNmZmZmZmZcIjtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxSZWN0KHRoaXMucGxheWVyLngsIHRoaXMucGxheWVyLnksIHRoaXMucGxheWVyLndpZHRoLCB0aGlzLnBsYXllci5oZWlnaHQpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFJlY3QodGhpcy5haS54LCB0aGlzLmFpLnksIHRoaXMuYWkud2lkdGgsIHRoaXMuYWkuaGVpZ2h0KTtcbiAgICAgICAgaWYgKHRoaXMuaXNUdXJuRGVsYXlPdmVyKCkpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsUmVjdCh0aGlzLnB1Y2sueCwgdGhpcy5wdWNrLnksIHRoaXMucHVjay53aWR0aCwgdGhpcy5wdWNrLmhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuc2V0TGluZURhc2goWzcsIDE1XSk7XG4gICAgICAgIHRoaXMuY29udGV4dC5tb3ZlVG8odGhpcy5jYW52YXMud2lkdGggLyAyLCB0aGlzLmNhbnZhcy5oZWlnaHQgLSAxNDApO1xuICAgICAgICB0aGlzLmNvbnRleHQubGluZVRvKHRoaXMuY2FudmFzLndpZHRoIC8gMiwgMTQwKTtcbiAgICAgICAgdGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IDEwO1xuICAgICAgICB0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIiNmZmZmZmZcIjtcbiAgICAgICAgdGhpcy5jb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9IFwiMTAwcHggQ291cmllciBOZXdcIjtcbiAgICAgICAgdGhpcy5jb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dCh0aGlzLnBsYXllci5wb2ludHMudG9TdHJpbmcoKSwgdGhpcy5jYW52YXMud2lkdGggLyAyIC0gMzAwLCAyMDApO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGhpcy5haS5wb2ludHMudG9TdHJpbmcoKSwgdGhpcy5jYW52YXMud2lkdGggLyAyICsgMzAwLCAyMDApO1xuICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9IFwiMzBweCBDb3VyaWVyIE5ld1wiO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoXCJSb3VuZCBcIiArICh0aGlzLnJvdW5kICsgMSksIHRoaXMuY2FudmFzLndpZHRoIC8gMiwgMzUpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9IFwiNDBweCBDb3VyaWVyXCI7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dCh0aGlzLmxldmVsc1t0aGlzLnJvdW5kXVxuICAgICAgICAgICAgPyB0aGlzLmxldmVsc1t0aGlzLnJvdW5kXS50b1N0cmluZygpXG4gICAgICAgICAgICA6IHRoaXMubGV2ZWxzW3RoaXMucm91bmQgLSAxXS50b1N0cmluZygpLCB0aGlzLmNhbnZhcy53aWR0aCAvIDIsIDEwMCk7XG4gICAgfVxuICAgIGdhbWVMb29wKCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUdhbWVPYmplY3RzKCk7XG4gICAgICAgIHRoaXMuZHJhd09iamVjdHMoKTtcbiAgICAgICAgaWYgKCF0aGlzLmdhbWVPdmVyKVxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuZ2FtZUxvb3AoKSk7XG4gICAgfVxuICAgIGFkZExpc3RlbmVycygpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5ydW5uaW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLmdhbWVMb29wKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJBcnJvd1VwXCIgfHwgZXZlbnQua2V5ID09PSBcIndcIilcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5tb3ZlbWVudCA9IHR5cGVzXzEuTW92ZS5VUDtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09IFwiQXJyb3dEb3duXCIgfHwgZXZlbnQua2V5ID09PSBcInNcIilcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5tb3ZlbWVudCA9IHR5cGVzXzEuTW92ZS5ET1dOO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGxheWVyLm1vdmVtZW50ID0gdHlwZXNfMS5Nb3ZlLlNUSUxMO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVzZXRUdXJuKHdpbm5lciwgbG9zZXIpIHtcbiAgICAgICAgdGhpcy5wdWNrID0gKDAsIHB1Y2tfMS5jcmVhdGVQdWNrKSh0aGlzLmNhbnZhcywgdGhpcy5wdWNrLnNwZWVkICsgMSk7IC8vIEluY3JlYXNlIHB1Y2sgc3BlZWRcbiAgICAgICAgdGhpcy50dXJuID0gbG9zZXI7XG4gICAgICAgIHRoaXMudGltZXIgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgd2lubmVyLnBvaW50cysrO1xuICAgIH1cbiAgICBpc1R1cm5EZWxheU92ZXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMudGltZXIgPj0gMTAwMDtcbiAgICB9XG4gICAgZ2V0TmV4dFJvdW5kQ29sb3IoKSB7XG4gICAgICAgIGNvbnN0IG5ld0NvbG9yID0gdGhpcy50aGVtZUNvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnRoZW1lQ29sb3JzLmxlbmd0aCldO1xuICAgICAgICBpZiAobmV3Q29sb3IgPT09IHRoaXMuY29sb3IpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXROZXh0Um91bmRDb2xvcigpO1xuICAgICAgICByZXR1cm4gbmV3Q29sb3I7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gR2FtZUVuZ2luZTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==