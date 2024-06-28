import { Paddle, Move } from "./types";

export function createPaddle(
  position: "left" | "right",
  canvas: HTMLCanvasElement
): Paddle {
  return {
    width: 18,
    height: 180,
    x: position === "left" ? 150 : canvas.width - 150,
    y: canvas.height / 2 - 35,
    points: 0,
    movement: Move.STILL,
    speed: 8,
  };
}
