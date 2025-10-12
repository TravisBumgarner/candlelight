import TabWrapper from "@/components/tab-wrapper";
import { ScrollView, Text } from "react-native";

const Credits = () => {
  return (
    <TabWrapper background="credits">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text>Credits</Text>
      </ScrollView>
    </TabWrapper>
  );
};

export default Credits;
