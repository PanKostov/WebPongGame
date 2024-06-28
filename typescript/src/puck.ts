import { Puck, Move } from "./types";

export function createPuck(
  canvas: HTMLCanvasElement,
  initialSpeed: number = 10
): Puck {
  return {
    width: 18,
    height: 18,
    x: canvas.width / 2 - 9,
    y: canvas.height / 2 - 9,
    velocityX: Move.STILL,
    velocityY: Move.STILL,
    speed: initialSpeed,
  };
}
