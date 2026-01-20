"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";
import type { FC, ReactNode } from "react";

interface TextShimmerWaveProps {
    children: string;
    as?: any;
    className?: string;
    duration?: number;
    zDistance?: number;
    xDistance?: number;
    yDistance?: number;
    spread?: number;
}

export const TextShimmerWave: FC<TextShimmerWaveProps> = ({
    children,
    as: Component = "p",
    className,
    duration = 1,
    zDistance = 10,
    xDistance = 2,
    yDistance = -2,
    spread = 1,
}) => {
    return (
        <Component className={cn("relative inline-block", className)}>
            {children.split("").map((char, i) => {
                return (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, x: xDistance, y: yDistance, z: zDistance }}
                        animate={{ opacity: 1, x: 0, y: 0, z: 0 }}
                        transition={{
                            duration: duration,
                            delay: i * (spread / children.length),
                            type: "spring",
                            damping: 12,
                            stiffness: 100,
                        }}
                        className="inline-block whitespace-pre"
                    >
                        {char}
                    </motion.span>
                );
            })}
        </Component>
    );
};
