import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TabItem = {
  id: string;
  title: string;
  value: string;
};

type AnimatedNavigationTabsProps = {
  items: TabItem[];
  activeId: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export function AnimatedNavigationTabs({
  items,
  activeId,
  onValueChange,
  className,
}: AnimatedNavigationTabsProps) {
  const [isHover, setIsHover] = useState<string | null>(null);
  const active = items.find((item) => item.value === activeId) || items[0];

  return (
    <div className={cn("relative w-full flex items-center justify-center", className)}>
      <div className="relative">
        <ul className="flex items-center justify-center">
          {items.map((item) => (
            <button
              key={item.id}
              className={cn(
                "py-2 relative duration-300 transition-colors hover:!text-primary",
                active.value === item.value
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              onClick={() => onValueChange(item.value)}
              onMouseEnter={() => setIsHover(item.value)}
              onMouseLeave={() => setIsHover(null)}
            >
              <div className="px-5 py-2 relative">
                {item.title}
                {isHover === item.value && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute bottom-0 left-0 right-0 w-full h-full bg-primary/10"
                    style={{
                      borderRadius: 6,
                    }}
                  />
                )}
              </div>
              {active.value === item.value && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {isHover === item.value && active.value !== item.value && (
                <motion.div
                  layoutId="hover-indicator"
                  className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </ul>
      </div>
    </div>
  );
}

