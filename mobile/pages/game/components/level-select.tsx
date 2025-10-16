import levelsData from "@/assets/react_native_levels.json";
import { default as Button } from "@/components/button";
import Text from "@/components/text";
import { View } from "react-native";

const LevelSelect = ({
  setSelectedLevelId,
}: {
  setSelectedLevelId: (id: string) => void;
}) => {
  return (
    <View>
      {levelsData.worlds.map((world) => (
        <View key={world.world_number}>
          <Text variant="header1" textAlign="center">
            World {`${world.world_number}`}: {world.world_name}
          </Text>
          {world.level_numbers.map((levelNum) => (
            <Button
              onPress={() =>
                setSelectedLevelId(`${world.world_number}_${levelNum}`)
              }
              key={levelNum}
              label={`Level ${levelNum}`}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default LevelSelect;