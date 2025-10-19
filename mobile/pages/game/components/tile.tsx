import { TileStyle } from "@/types";
import { Image } from "expo-image";
import React from "react";
import { View } from "react-native";
import { SPRITE_SIZE } from "./game.consts";

const SPRITE_SRC = require("@/assets/sprites/tiles.png");
const COLUMNS = 10;

const getTileStyleIndex = (type: TileStyle): number => {
  switch (type) {
    case "EMPTY":
      return -1;
    case "DARK_INACTIVE":
      return 0;
    case "DARK_ACTIVE":
      return 1;
    case "LIGHT_INACTIVE":
      return 2;
    case "LIGHT_ACTIVE":
      return 3;
    case "MID_BORDER":
      return 4;
    case "GEM_BLUE_ACTIVE":
      return 5;
    default:
      return -1;
  }
};

interface TileProps {
  type: TileStyle;
  size: number; // desired on-screen tile size
}

export const Tile: React.FC<TileProps> = ({ type, size }) => {
  const tileIndex = getTileStyleIndex(type);
  const scale = size / SPRITE_SIZE; // 👈 math-based scale factor

  if (tileIndex === -1) {
    return (
      <View
        style={{ width: size, height: size, backgroundColor: "transparent" }}
      />
    );
  }

  // sprite sheet offset
  const x = (tileIndex % COLUMNS) * SPRITE_SIZE;
  const y = Math.floor(tileIndex / COLUMNS) * SPRITE_SIZE;

  return (
    <View style={{ width: size, height: size, overflow: "hidden" }}>
      <Image
        source={SPRITE_SRC}
        style={{
          width: COLUMNS * SPRITE_SIZE * scale, // scaled sheet width
          height: SPRITE_SIZE * scale, // scaled row height
          marginLeft: -x * scale, // scaled offset
          marginTop: -y * scale,
        }}
      />
    </View>
  );
};
