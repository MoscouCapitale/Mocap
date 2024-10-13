import React from "preact/compat";
import { cn } from "@utils/cn.ts";

type GradientProps = {
  children: React.ReactNode;
  width?: string;
  height?: string;
  colors?: {
    col1?: string;
    col2?: string;
    col3?: string;
    col4?: string;
    col5?: string;
  };
  sx?: string;
};

export default function Gradient({
  children,
  width,
  height,
  colors,
  sx,
}: GradientProps) {
  return (
    <svg
      className={cn("", sx)}
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "2000"}
      height={height ?? "2000"}
      viewBox={`0 0 ${width ?? "2000"} ${height ?? "2000"}`}
      style={{
        "--gradient-color-1": colors?.col1 ?? "#FFFFFF00",
        "--gradient-color-2": colors?.col2 ?? "#000000",
        "--gradient-color-3": colors?.col3 ?? "#000000",
        "--gradient-color-4": colors?.col4 ?? "#000000",
        "--gradient-color-5": colors?.col5 ?? "#000000",
      }}
    >
      {children}
    </svg>
  );
}
