import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PenSquare, Calendar, Send, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- HoverGradientNavTabs Component ---

interface HoverGradientTabItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
  iconColor: string;
}

// Animation variants
const itemVariants: Variants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants: Variants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 0.4,
    scale: 1.5,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const sharedTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

type HoverGradientNavTabsProps = {
  items: HoverGradientTabItem[];
  activeId: string;
  onValueChange: (value: string) => void;
  className?: string;
};

export function HoverGradientNavTabs({
  items,
  activeId,
  onValueChange,
  className,
}: HoverGradientNavTabsProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      <motion.nav
        className="w-fit px-2 md:px-4 py-2 md:py-3 rounded-2xl bg-white/90 dark:bg-black/80 backdrop-blur-lg border border-gray-200/80 dark:border-gray-800/80 shadow-lg md:shadow-xl relative"
        initial="initial"
      >
        <ul className="flex items-center justify-center gap-1 md:gap-3 relative z-10">
          {items.map((item: HoverGradientTabItem) => {
            const isActive = activeId === item.value;
            return (
              <motion.li key={item.value} className="relative flex-none">
                <motion.div
                  className="block rounded-xl md:rounded-2xl overflow-visible group relative"
                  style={{ perspective: "600px" }}
                  whileHover="hover"
                  initial="initial"
                >
                  {/* Per-item glow */}
                  <motion.div
                    className="absolute inset-0 z-0 pointer-events-none rounded-xl md:rounded-2xl"
                    variants={glowVariants}
                    style={{
                      background: item.gradient,
                      opacity: 0,
                    }}
                  />
                  {/* Front-facing */}
                  <motion.button
                    onClick={() => onValueChange(item.value)}
                    className={cn(
                      "flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-2 py-1.5 md:px-4 md:py-2 relative z-10 bg-transparent transition-colors rounded-xl md:rounded-2xl text-xs md:text-sm",
                      isActive
                        ? "text-primary dark:text-primary font-medium"
                        : "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                    )}
                    variants={itemVariants}
                    transition={sharedTransition}
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "center bottom"
                    }}
                  >
                    <span className={cn("transition-colors duration-300", isActive ? "text-primary" : item.iconColor)}>
                      {item.icon}
                    </span>
                    <span className="hidden md:inline font-medium">{item.label}</span>
                  </motion.button>
                  {/* Back-facing */}
                  <motion.button
                    onClick={() => onValueChange(item.value)}
                    className={cn(
                      "flex flex-col md:flex-row items-center justify-center gap-0.5 md:gap-2 px-2 py-1.5 md:px-4 md:py-2 absolute inset-0 z-10 bg-transparent transition-colors rounded-xl md:rounded-2xl text-xs md:text-sm",
                      isActive
                        ? "text-primary dark:text-primary font-medium"
                        : "text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                    )}
                    variants={backVariants}
                    transition={sharedTransition}
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "center top",
                      transform: "rotateX(90deg)"
                    }}
                  >
                    <span className={cn("transition-colors duration-300", isActive ? "text-primary" : item.iconColor)}>
                      {item.icon}
                    </span>
                    <span className="hidden md:inline font-medium">{item.label}</span>
                  </motion.button>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </motion.nav>
    </div>
  );
}

// Export helper to create tab items
export function createContentManagementTabs() {
  return [
    {
      icon: <PenSquare className="h-5 w-5" />,
      label: "Create Post",
      value: "cross-post",
      gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
      iconColor: "group-hover:text-blue-500 dark:group-hover:text-blue-400",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Content Calendar",
      value: "calendar",
      gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
      iconColor: "group-hover:text-green-500 dark:group-hover:text-green-400",
    },
    {
      icon: <Send className="h-5 w-5" />,
      label: "Published Posts",
      value: "published",
      gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
      iconColor: "group-hover:text-orange-500 dark:group-hover:text-orange-400",
    },
    {
      icon: <LayoutTemplate className="h-5 w-5" />,
      label: "Templates",
      value: "templates",
      gradient: "radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(126,34,206,0.06) 50%, rgba(88,28,135,0) 100%)",
      iconColor: "group-hover:text-purple-500 dark:group-hover:text-purple-400",
    },
  ];
}
