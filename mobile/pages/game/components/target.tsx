import { Board, createBoardKey, Shape, TILE_STYLES } from "@/types";
import { useMemo } from "react";
import Grid from "../components/grid";

const Target = ({ target }: { target: Shape }) => {
  const items = useMemo(() => {
    return target.reduce((acc, coordinate) => {
      const boardKey = createBoardKey(coordinate);
      acc[boardKey] = { type: TILE_STYLES.GEM_BLUE_ACTIVE, coordinate };
      return acc;
    }, {} as Board);
  }, [target]);

  return <Grid width={6} height={6} items={items} />;
};

export default Target;
