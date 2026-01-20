"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface OrbitingCirclesProps extends React.HTMLAttributes<HTMLDivElement> {
    duration?: number; // seconds
    delay?: number; // seconds
    radius?: number; // pixels
    reverse?: boolean;
    startAngleDeg?: number; // initial orbital angle offset
    children: React.ReactNode;
}

export function OrbitingCircles({
    className,
    duration = 20,
    delay = 0,
    radius = 140,
    reverse = false,
    startAngleDeg = 0,
    children,
    ...props
}: OrbitingCirclesProps) {
    const style = React.useMemo<React.CSSProperties>(() => ({
        ["--duration" as any]: String(duration),
        ["--radius" as any]: String(radius),
        animationDelay: `${delay}s`,
        animationDirection: reverse ? ("reverse" as const) : undefined,
    }), [duration, radius, delay, reverse]);

    return (
        <div
            className={cn(
                "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                className,
            )}
            {...props}
        >
            {/* Local fallback for keyframes to ensure animation works without global CSS */}
            <style>{`
        @keyframes orbit { 
          0% { transform: rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg); }
          100% { transform: rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg); }
        }
      `}</style>
            <div style={{ transform: `rotate(${startAngleDeg}deg)` }}>
                <div
                    className="will-change-transform"
                    style={{
                        ...style,
                        animation: `orbit ${duration}s linear infinite`,
                    }}
                >
                    <div className="pointer-events-auto" style={{ transform: `rotate(${-startAngleDeg}deg)` }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrbitingCircles;
