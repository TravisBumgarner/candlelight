import { default as PixelMenuButton } from "@/components/button";
import { Coordinate, GamePiece, PieceType, Shape } from "@/types";
import { useCallback } from "react";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./game.consts";
import { SHAPES_DICT } from "./shapes";

const Controls = ({
  currentGamePiece,
  updateGamePiece,
  setHistory,
  queue,
  setQueue,
  handlePlaceCallback,
}: {
  updateGamePiece: (piece: GamePiece) => void;
  currentGamePiece: GamePiece;
  setHistory: (history: (prev: Shape[]) => Shape[]) => void;
  queue: PieceType[];
  setQueue: (queue: (prev: PieceType[]) => PieceType[]) => void;
  handlePlaceCallback: ({
    nextGamePiece,
  }: {
    nextGamePiece: GamePiece;
  }) => void;
}) => {
  const shapeInBounds = useCallback((shape: Shape) => {
    return shape.every((coordinate) => {
      const { x, y } = coordinate;
      return y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH;
    });
  }, []);

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      let movedPiece: Shape = [];

      let offset: Coordinate = { x: 0, y: 0 };
      switch (direction) {
        case "up":
          offset = { x: -1, y: 0 };
          break;
        case "down":
          offset = { x: 1, y: 0 };
          break;
        case "left":
          offset = { x: 0, y: -1 };
          break;
        case "right":
          offset = { x: 0, y: 1 };
          break;
      }
      movedPiece = SHAPES_DICT[currentGamePiece.type][
        currentGamePiece.rotation
      ].map(({ y, x }) => ({
        x: currentGamePiece.offset.x + x + offset.x,
        y: currentGamePiece.offset.y + y + offset.y,
      }));

      const isOutOfBounds = !shapeInBounds(movedPiece);

      if (isOutOfBounds) {
        alert("bad!");
        return;
      }
      const newGamePiece: GamePiece = {
        ...currentGamePiece,
        offset: {
          x: currentGamePiece.offset.x + offset.x,
          y: currentGamePiece.offset.y + offset.y,
        },
      };
      updateGamePiece(newGamePiece);
    },
    [currentGamePiece, updateGamePiece, shapeInBounds]
  );

  const rotate = useCallback(() => {
    // Rotate around the first block in the shape
    const tempRotationIndex = (currentGamePiece.rotation + 1) % 4;
    const shape = SHAPES_DICT[currentGamePiece.type][tempRotationIndex];
    if (!shape) return;

    // Check if the rotated shape is in bounds
    const offsetShape = shape.map(({ y, x }) => ({
      y: y + currentGamePiece.offset.y,
      x: x + currentGamePiece.offset.x,
    }));
    if (!shapeInBounds(offsetShape)) {
      alert("Can't rotate out of bounds!");
      return;
    }

    updateGamePiece({
      ...currentGamePiece,
      rotation: tempRotationIndex,
    });
  }, [shapeInBounds, currentGamePiece, updateGamePiece]);

  const place = useCallback(() => {
    setHistory((prev) => [
      ...prev,
      SHAPES_DICT[currentGamePiece.type][currentGamePiece.rotation].map(
        ({ y, x }) => ({
          y: y + currentGamePiece.offset.y,
          x: x + currentGamePiece.offset.x,
        })
      ),
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

    const nextGamePiece = {
      type: queue[0],
      rotation: 0,
      offset: {
        y: Math.floor(BOARD_HEIGHT / 2) - 1,
        x: Math.floor(BOARD_WIDTH / 2) - 1,
      },
    } as GamePiece;
    setQueue((prev) => prev.slice(1));
    handlePlaceCallback({ nextGamePiece });
  }, [queue, setHistory, setQueue, handlePlaceCallback, currentGamePiece]);

  return (
    <>
      <PixelMenuButton label="Up" onPress={() => move("up")} />
      <PixelMenuButton label="Left" onPress={() => move("left")} />
      <PixelMenuButton label="Right" onPress={() => move("right")} />
      <PixelMenuButton label="Down" onPress={() => move("down")} />
      <PixelMenuButton label="Place" onPress={place} />
      <PixelMenuButton label="Rotate" onPress={rotate} />
      <PixelMenuButton disabled label="Undo" onPress={() => {}} />
    </>
  );
};

export default Controls;
