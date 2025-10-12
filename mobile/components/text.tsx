import { StyleSheet, Text as TextRN } from "react-native";

const Text = ({
  children,
  variant,
  textAlign = "left",
}: {
  children: React.ReactNode;
  variant: "header1" | "body1";
  textAlign?: "left" | "center" | "right";
}) => {
  return (
    <TextRN style={{ ...styles[variant], ...styles.base, textAlign }}>
      {children}
    </TextRN>
  );
};

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    color: "#fff",
  },
  header1: {
    fontSize: 32,
    fontWeight: "bold",
  },
  body1: {
    fontSize: 16,
  },
});

export default Text;
