"use client";

import React, { useEffect, useState } from "react";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { RedditIcon, LinkedInIcon, InstagramIcon, XIcon } from "@/components/BrandIcons";

export function OrbitingPlatforms() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const rInner = isMobile ? 80 : 140;
    const rOuter = isMobile ? 140 : 240;

    return (
        <div className="relative flex h-[350px] md:h-[560px] w-full flex-col items-center justify-center overflow-hidden">
            {/* Center Text */}
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300 bg-clip-text text-center text-5xl md:text-6xl font-bold leading-none text-transparent dark:from-white dark:to-gray-500">
                ShowWork
            </span>

            {/* Visual orbit ring lines */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/15 transition-all duration-500" style={{ width: rInner * 2, height: rInner * 2 }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10 transition-all duration-500" style={{ width: rOuter * 2, height: rOuter * 2 }} />

            {/* Inner orbit: LinkedIn & Instagram */}
            <OrbitingCircles className="size-[32px] md:size-[48px] border-none bg-transparent" duration={21} delay={0} radius={rInner} startAngleDeg={-90}>
                <LinkedInIcon className="w-8 h-8 md:w-12 md:h-12 text-blue-700" />
            </OrbitingCircles>
            <OrbitingCircles className="size-[32px] md:size-[48px] border-none bg-transparent" duration={23} delay={0} radius={rInner} startAngleDeg={90} reverse>
                <InstagramIcon className="w-8 h-8 md:w-12 md:h-12 text-pink-500" />
            </OrbitingCircles>

            {/* Outer orbit: X & Reddit */}
            <OrbitingCircles className="size-[40px] md:size-[56px] border-none bg-transparent" radius={rOuter} duration={27} delay={0} startAngleDeg={45} reverse>
                <XIcon className="w-10 h-10 md:w-14 md:h-14" />
            </OrbitingCircles>
            <OrbitingCircles className="size-[40px] md:size-[56px] border-none bg-transparent" radius={rOuter} duration={31} delay={0} startAngleDeg={225}>
                <RedditIcon className="w-10 h-10 md:w-14 md:h-14 text-orange-500" />
            </OrbitingCircles>
        </div>
    );
}

export default OrbitingPlatforms;
