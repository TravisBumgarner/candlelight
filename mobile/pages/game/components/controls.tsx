import { default as PixelMenuButton } from "@/components/button";
import { Coordinate, GamePiece, PieceType, Shape } from "@/types";
import { useCallback, useMemo } from "react";
import {
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  View,
} from "react-native";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./game.consts";
import { SHAPES_DICT } from "./shapes";

const THRESHOLD = 20;

const Controls = ({
  currentGamePiece,
  updateGamePiece,
  history,
  setHistory,
  queue,
  setQueue,
  handlePlaceCallback,
  children,
}: {
  children: React.ReactNode;
  updateGamePiece: (piece: GamePiece) => void;
  currentGamePiece: GamePiece;
  history: GamePiece[];
  setHistory: (history: GamePiece[]) => void;
  queue: PieceType[];
  setQueue: (queue: ((prev: PieceType[]) => PieceType[]) | PieceType[]) => void;
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

  const undo = useCallback(() => {
    // const newHistory = [...history];
    // const newQueue = [...queue];
  }, [setHistory, history]);

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      const delta: Coordinate = { x: 0, y: 0 };
      switch (direction) {
        case "up":
          delta.y = -1;
          break;
        case "down":
          delta.y = 1;
          break;
        case "left":
          delta.x = -1;
          break;
        case "right":
          delta.x = 1;
          break;
      }

      // compute new offset once
      const newOffset = {
        x: currentGamePiece.offset.x + delta.x,
        y: currentGamePiece.offset.y + delta.y,
      };

      // build moved shape using that new offset
      const movedShape: Shape = SHAPES_DICT[currentGamePiece.type][
        currentGamePiece.rotation
      ].map(({ x, y }) => ({
        x: x + newOffset.x,
        y: y + newOffset.y,
      }));

      if (!shapeInBounds(movedShape)) {
        alert("bad!");
        return;
      }

      updateGamePiece({
        ...currentGamePiece,
        offset: newOffset,
      });
    },
    [currentGamePiece, updateGamePiece, shapeInBounds]
  );

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: (
          _: GestureResponderEvent,
          gesture: PanResponderGestureState
        ) => {
          const { dx, dy } = gesture;
          if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > THRESHOLD) move("right");
            else if (dx < -THRESHOLD) move("left");
          } else {
            if (dy > THRESHOLD) move("down");
            else if (dy < -THRESHOLD) move("up");
          }
        },
      }),
    [move]
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
    setHistory([...history, currentGamePiece]);

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
  }, [
    queue,
    setHistory,
    setQueue,
    handlePlaceCallback,
    currentGamePiece,
    history,
  ]);

  return (
    <View {...responder.panHandlers}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <PixelMenuButton label="Place" onPress={place} />
        <PixelMenuButton label="Rotate" onPress={rotate} />
        <PixelMenuButton disabled label="Undo" onPress={undo} />
      </View>
      {children}
    </View>
  );
};

export default Controls;
