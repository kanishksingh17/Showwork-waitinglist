import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BouncyCardsFeatures = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 text-slate-800 dark:text-slate-200">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end md:px-4 mt-8">
        <h2 className="max-w-lg text-4xl font-bold md:text-5xl">
          Grow faster with our
          <span className="text-slate-400 dark:text-slate-500"> all-in-one solution</span>
        </h2>
      </div>
      <div className="mb-4 grid grid-cols-12 gap-3">
        <BounceCard className="col-span-12 md:col-span-6">
          <CardTitle>Showcase Projects with Sparky AI</CardTitle>
          <div className="absolute bottom-0 left-2 right-2 top-28 sm:top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-blue-400 to-cyan-400 p-4 transition-transform duration-300 group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-cyan-50 text-sm leading-relaxed">
              Chat with Sparky AI assistant to add and showcase your projects effortlessly. Just describe your project and let AI handle the rest
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-6">
          <CardTitle>AI Insights & Analytics</CardTitle>
          <div className="absolute bottom-0 left-2 right-2 top-28 sm:top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-yellow-400 to-amber-400 p-4 transition-transform duration-300 group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-amber-900 text-sm leading-relaxed">
              Get AI-powered insights about which projects are performing best and where you should focus your efforts for maximum impact
            </span>
          </div>
        </BounceCard>
      </div>
      <div className="grid grid-cols-12 gap-3">
        <BounceCard className="col-span-12 md:col-span-7">
          <CardTitle>AI Job Detection & Portfolio Builder</CardTitle>
          <div className="absolute bottom-0 left-2 right-2 top-28 sm:top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-green-400 to-emerald-400 p-4 transition-transform duration-300 group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-emerald-50 text-sm leading-relaxed">
              AI-powered job detection helps you build the perfect portfolio. Create stunning portfolios with 50+ professional templates designed for developers
            </span>
          </div>
        </BounceCard>
        <BounceCard className="col-span-12 md:col-span-5">
          <CardTitle>Community</CardTitle>
          <div className="absolute bottom-0 left-2 right-2 top-28 sm:top-32 translate-y-8 rounded-t-2xl bg-gradient-to-br from-pink-400 to-red-400 p-4 transition-transform duration-300 group-hover:translate-y-4 group-hover:rotate-[2deg]">
            <span className="block text-center font-semibold text-red-50 text-xs sm:text-sm leading-relaxed">
              Discover recent projects and content posted by users. Interact with the community, get inspired, and showcase your work
            </span>
          </div>
        </BounceCard>
      </div>
    </section>
  );
};

const BounceCard = ({ className, children }: { className: string; children: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ scale: 0.95, rotate: "-1deg" }}
      whileTap={{ scale: 0.95, rotate: "-1deg" }}
      className={cn(
        "group relative min-h-[250px] sm:min-h-[300px] cursor-pointer overflow-hidden rounded-2xl bg-slate-100 p-6 sm:p-8",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="mx-auto text-center text-2xl sm:text-3xl font-semibold">{children}</h3>
  );
};

