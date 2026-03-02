import { StyleSheet } from "react-native";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { colors } from "../../constants/colors";
import { Fonts } from "../../assets/fonts";
import { normalizeSize } from "../../../utils";

export const styles = StyleSheet.create({
  headerview: {
    width: "100%",
    paddingHorizontal: getWidth(5),
    height: normalizeSize(85),
    flexDirection: "row",
    zIndex: 1,
    justifyContent: "space-between",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: "center",
  },

  headingtext: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontFamily: Fonts.PoppinsBold,
    marginTop: normalizeSize(10),
    marginRight: normalizeSize(20),
  },
});
