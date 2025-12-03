import React from "react";

interface SpinnerProps {
  size?: number;      
  color?: string;     
  borderWidth?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 20,
  color = "border-white",
  borderWidth = 2,
}) => {
  return (
    <div
      className={`animate-spin rounded-full border-t-transparent ${color}`}
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth,
        borderStyle: "solid",
      }}
    />
  );
};

export default Spinner;
