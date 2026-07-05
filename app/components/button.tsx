import { Button } from "@/components/ui/button";
import { motion, type MotionProps } from "framer-motion";
import { ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof Button>;
type MotionButtonProps = ButtonProps & MotionProps;

const MotionButton = motion.create(Button as React.ComponentType<React.PropsWithChildren<object>>) as React.ComponentType<MotionButtonProps>;

export default function DefaultButton({ children, ...props }: MotionButtonProps) {
  return (
    <MotionButton
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}