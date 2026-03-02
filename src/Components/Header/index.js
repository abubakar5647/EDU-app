import * as React from "react";
import { Text, View } from "react-native";
import { styles } from "./style";
import { colors } from "../../constants/colors";

const Header = ({
  title,
  LeftIcon,
  RightIcon,
  TitelStyle,
  backgroundColor,
  color,
  description,
}) => {
  return (
    <View
      style={[
        styles.headerview,
        { backgroundColor: backgroundColor || colors.primary },
      ]}
    >
      {LeftIcon}
      <Text
        style={[
          TitelStyle ? TitelStyle : styles.headerTitle,
          { color: color || "white" },
        ]}
      >
        {title}
      </Text>

      {description && (
        <Text style={[{ color: color || "white" }]}>{description}</Text>
      )}

      {RightIcon}
    </View>
  );
};
export default Header;
