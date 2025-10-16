import { default as PixelMenuButton } from "@/components/button";
import { Coordinate, PieceType, Shape } from "@/types";
import { useCallback } from "react";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./game.consts";
import { SHAPES_DICT } from "./shapes";

const Controls = ({
  currentPieceKey,
  currentPieceRotation,
  currentPieceOffset,
  setCurrentPieceKey,
  setCurrentPieceRotation,
  setCurrentPieceOffset,
  setHistory,
  queue,
  setQueue,
}: {
  currentPieceKey: PieceType;
  currentPieceRotation: number;
  currentPieceOffset: Coordinate;
  setCurrentPieceKey: (key: PieceType | null) => void;
  setCurrentPieceRotation: (rotation: number) => void;
  setCurrentPieceOffset: (offset: Coordinate) => void;
  setHistory: (history: (prev: Shape[]) => Shape[]) => void;
  queue: PieceType[];
  setQueue: (queue: (prev: PieceType[]) => PieceType[]) => void;
}) => {
  const shapeInBounds = useCallback((shape: Shape) => {
    return shape.every((coordinate) => {
      const [y, x] = coordinate;
      return y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH;
    });
  }, []);

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (currentPieceKey === null) return;

      let movedPiece: Shape = [];

      let offset: Coordinate = [0, 0];
      switch (direction) {
        case "up":
          offset = [-1, 0];
          break;
        case "down":
          offset = [1, 0];
          break;
        case "left":
          offset = [0, -1];
          break;
        case "right":
          offset = [0, 1];
          break;
      }
      movedPiece = SHAPES_DICT[currentPieceKey][currentPieceRotation].map(
        ([y, x]) => [
          currentPieceOffset[0] + y + offset[0],
          currentPieceOffset[1] + x + offset[1],
        ]
      );

      const isOutOfBounds = !shapeInBounds(movedPiece);

      if (isOutOfBounds) {
        alert("bad!");
        return;
      }
      const newCurrentPieceOffset: Coordinate = [
        currentPieceOffset[0] + offset[0],
        currentPieceOffset[1] + offset[1],
      ];
      setCurrentPieceOffset(newCurrentPieceOffset);
    },
    [
      currentPieceKey,
      shapeInBounds,
      currentPieceOffset,
      currentPieceRotation,
      setCurrentPieceOffset,
    ]
  );

  const rotate = useCallback(() => {
    if (currentPieceKey === null) return;

    // Rotate around the first block in the shape
    const tempRotationIndex = (currentPieceRotation + 1) % 4;
    const shape = SHAPES_DICT[currentPieceKey][tempRotationIndex];
    if (!shape) return;

    // Check if the rotated shape is in bounds
    const offsetShape = shape.map(
      ([y, x]) =>
        [y + currentPieceOffset[0], x + currentPieceOffset[1]] as Coordinate
    );
    if (!shapeInBounds(offsetShape)) {
      alert("Can't rotate out of bounds!");
      return;
    }

    setCurrentPieceRotation(tempRotationIndex);
  }, [
    currentPieceKey,
    currentPieceRotation,
    shapeInBounds,
    currentPieceOffset,
    setCurrentPieceRotation,
  ]);

  const place = useCallback(() => {
    if (currentPieceKey === null) return;

    setHistory((prev) => [
      ...prev,
      SHAPES_DICT[currentPieceKey][currentPieceRotation].map(([y, x]) => [
        y + currentPieceOffset[0],
        x + currentPieceOffset[1],
      ]),
    ]);

    if (queue.length === 0) {
      alert("No more pieces in the queue!");
      return;
    }

    const nextShapeKey = SHAPES_DICT[queue[0]];
    if (!nextShapeKey) {
      alert("Invalid shape key in queue!");
      return;
    }

    setCurrentPieceKey(queue[0]);
    setCurrentPieceRotation(0);
    setQueue((prev) => prev.slice(1));
    setCurrentPieceOffset([
      Math.floor(BOARD_HEIGHT / 2) - 1,
      Math.floor(BOARD_WIDTH / 2) - 1,
    ]);
  }, [
    currentPieceKey,
    currentPieceRotation,
    currentPieceOffset,
    queue,
    setHistory,
    setCurrentPieceKey,
    setCurrentPieceRotation,
    setQueue,
    setCurrentPieceOffset,
  ]);

  return (
    <>
      <PixelMenuButton label="Up" onPress={() => move("up")} />
      <PixelMenuButton label="Left" onPress={() => move("left")} />
      <PixelMenuButton label="Right" onPress={() => move("right")} />
      <PixelMenuButton label="Down" onPress={() => move("down")} />
      <PixelMenuButton label="Place" onPress={place} />
      <PixelMenuButton label="Rotate" onPress={rotate} />
    </>
  );
};

export default Controls;
