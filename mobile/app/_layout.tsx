import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#f4f4f4",
            width: 240,
          },
          drawerContentStyle: {
            paddingTop: 50,
          },
          drawerActiveTintColor: "#e91e63",
          drawerInactiveTintColor: "#666",
          drawerActiveBackgroundColor: "#e8f4f8",
          drawerInactiveBackgroundColor: "transparent",
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
          drawerItemStyle: {
            marginVertical: 5,
            borderRadius: 10,
          },
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }} />
        <Drawer.Screen name="credits" options={{ title: "Credits" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
