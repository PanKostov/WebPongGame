"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPuck = void 0;
const types_1 = require("./types");
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
