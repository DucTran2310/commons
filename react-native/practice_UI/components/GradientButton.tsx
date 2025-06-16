import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { StyledLinearGradient } from "./StyledLinearGradient";

type GradientButtonProps = {
  value: string;
  onPress?: () => void;
  containerClass: string;
  buttonClass?: string;
} & TouchableOpacityProps;

export default function GradientButton({
  value,
  onPress,
  containerClass = "",
  buttonClass = "",
  ...rest
}: GradientButtonProps) {
  return (
    <StyledLinearGradient
      colors={["rgba(9, 181, 211, 0.9)", "rgba(58, 131, 244,0.9)"]}
      end={{ x: 1, y: 1 }}
      start={{ x: 0.1, y: 0.2 }}
      className={`rounded-full ${containerClass}`}
    >
      <TouchableOpacity
        className={`p-3 px-4 ${buttonClass}`}
        onPress={onPress}
        {...rest}
      >
        <Text className="text-white font-bold">{value}</Text>
      </TouchableOpacity>
    </StyledLinearGradient>
  );
}