import TabWrapper from "@/components/tab-wrapper";
import { ScrollView, Text } from "react-native";

const Settings = () => {
  return (
    <TabWrapper background="settings">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text>Settings</Text>
      </ScrollView>
    </TabWrapper>
  );
};

export default Settings;
