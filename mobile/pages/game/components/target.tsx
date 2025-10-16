import { Shape } from "@/types";
import Grid from "../components/grid";

const Target = ({ target }: { target: Shape }) => {
  return (
    <Grid
      width={6}
      height={6}
      items={target.map((coordinate) => ({ coordinate, type: "gem" }))}
    />
  );
};

export default Target;
