"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaddle = void 0;
const types_1 = require("./types");
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
