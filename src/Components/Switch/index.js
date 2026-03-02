import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../constants/colors";

const SwitchComponent = ({ value, onValueChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        toggleSwitch()
        onValueChange(!value)
      }}>
      <View
        style={[
          styles.switchCircle,
          {
            backgroundColor: isEnabled ? colors.primary : "#ccc",
            marginLeft: isEnabled ? 20 : 3,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 30,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderRadius: 15,
    padding: 3,
    borderColor: colors.primary,
  },
  switchCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    transition: "margin 0.2s", // Optional: smooth transition
  },
});

export default SwitchComponent;
