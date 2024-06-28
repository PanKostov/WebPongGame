export enum Move {
  STILL,
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export interface Paddle {
  width: number;
  height: number;
  x: number;
  y: number;
  points: number;
  movement: Move;
  speed: number;
}

export interface Puck {
  width: number;
  height: number;
  x: number;
  y: number;
  velocityX: Move;
  velocityY: Move;
  speed: number;
}
