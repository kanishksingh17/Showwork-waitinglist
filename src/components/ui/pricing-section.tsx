"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InView } from "@/components/ui/in-view";
import { Briefcase, CheckCheck, Database, Server, Zap, Globe, Users, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    description:
      "Perfect for individual developers and freelancers getting started with ShowWork",
    price: { usd: 9, inr: 299 },
    yearlyPrice: { usd: 79, inr: 2499 },
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "2 Portfolios", icon: <Briefcase size={20} /> },
      { text: "Up to 10 projects in showcase", icon: <Database size={20} /> },
      { text: "AI Content Generation", icon: <Zap size={20} /> },
      { text: "5 social posts per month", icon: <FileText size={20} /> },
      { text: "Showcase project feature", icon: <Globe size={20} /> },
    ],
    includes: [
      "Includes:",
      "Multi-platform publishing",
      "Basic analytics",
      "Portfolio templates",
    ],
  },
  {
    name: "Pro",
    description:
      "Best value for growing developers and teams that need advanced features",
    price: { usd: 29, inr: 999 },
    yearlyPrice: { usd: 249, inr: 7999 },
    buttonText: "Get started",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      { text: "5 Portfolios", icon: <Briefcase size={20} /> },
      { text: "Unlimited projects in showcase", icon: <Database size={20} /> },
      { text: "Advanced AI Content Generation", icon: <Zap size={20} /> },
      { text: "50 social posts per month", icon: <FileText size={20} /> },
      { text: "Sparky AI Assistant", icon: <Users size={20} /> },
    ],
    includes: [
      "Everything in Starter, plus:",
      "AI Job Detection",
      "Advanced analytics & insights",
      "Community features",
    ],
  },
  {
    name: "Ultimate",
    description:
      "Advanced plan with enhanced features and unlimited access for large teams",
    price: { usd: 79, inr: 2499 },
    yearlyPrice: { usd: 699, inr: 19999 },
    buttonText: "Get started",
    buttonVariant: "outline" as const,
    features: [
      { text: "Unlimited Portfolios", icon: <Briefcase size={20} /> },
      { text: "Unlimited projects", icon: <Database size={20} /> },
      { text: "Unlimited AI Content Generation", icon: <Zap size={20} /> },
      { text: "Unlimited social posts", icon: <FileText size={20} /> },
      { text: "Priority Sparky AI Assistant", icon: <Users size={20} /> },
    ],
    includes: [
      "Everything in Pro, plus:",
      "Priority support",
      "Custom integrations",
      "Team collaboration & workspace",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center mb-12">
      <div className="relative z-50 mx-auto flex w-fit rounded-full bg-neutral-50 border border-gray-200 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={`relative z-10 w-fit sm:h-12 h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${selected === "0"
              ? "text-white"
              : "text-muted-foreground hover:text-black"
            }`}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={`relative z-10 w-fit sm:h-12 h-8 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors ${selected === "1"
              ? "text-white"
              : "text-muted-foreground hover:text-black"
            }`}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 sm:h-12 h-10 w-full rounded-full border-4 shadow-sm shadow-blue-600 border-blue-600 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-600"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-black">
              Save 20%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [currency, setCurrency] = useState<"usd" | "inr">(() => {
    // Detect Indian users based on timezone or locale (client-side only)
    if (typeof window === "undefined") return "usd";
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = navigator.language || navigator.languages[0];
      return timezone.includes("Asia/Kolkata") || locale.includes("en-IN") ? "inr" : "usd";
    } catch {
      return "usd";
    }
  });

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <section id="pricing" className="px-4 pt-20 pb-20 mx-auto relative bg-neutral-100 dark:bg-slate-900">
      <div
        className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at center, #3b82f6 0%, transparent 70%)
      `,
          opacity: 0.1,
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative z-10 text-center mb-6 max-w-3xl mx-auto">
        <InView
          variants={revealVariants}
          transition={{ duration: 0.5 }}
        >
          <h2 className="md:text-6xl sm:text-4xl text-3xl font-medium text-gray-900 dark:text-white mb-4">
            Plans that work best for{" "}
            <span className="border border-dashed border-blue-500 px-2 py-1 rounded-xl bg-blue-100 dark:bg-blue-900 capitalize inline-block">
              you
            </span>
          </h2>
        </InView>

        <InView
          variants={revealVariants}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="sm:text-base text-sm text-gray-600 dark:text-gray-300 sm:w-[70%] w-[80%] mx-auto">
            Trusted by developers worldwide. Explore which option is right for you.
          </p>
        </InView>
      </div>

      <div className="relative z-10">
        <PricingSwitch onSwitch={togglePricingPeriod} />
      </div>

      <div className="grid md:grid-cols-3 max-w-7xl gap-4 py-6 mx-auto relative z-10">
        {plans.map((plan, index) => (
          <InView
            key={plan.name}
            variants={revealVariants}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            viewOptions={{ once: true }}
          >
            <Card
              className={`relative border-neutral-200 dark:border-slate-700 ${plan.popular ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/30" : "bg-white dark:bg-slate-800"
                }`}
            >
              <CardHeader className="text-left">
                <div className="flex justify-between">
                  <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <div className="">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-semibold text-gray-900 dark:text-white">
                    {currency === "inr" ? "₹" : "$"}{isYearly ? plan.yearlyPrice[currency] : plan.price[currency]}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setCurrency("usd")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${currency === "usd"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                  >
                    USD
                  </button>
                  <button
                    onClick={() => setCurrency("inr")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${currency === "inr"
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                  >
                    INR
                  </button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  className={`w-full mb-6 p-4 text-xl rounded-xl transition-all ${plan.popular
                      ? "bg-gradient-to-t from-blue-500 to-blue-600 shadow-lg shadow-blue-500 border border-blue-400 text-white hover:from-blue-600 hover:to-blue-700"
                      : plan.buttonVariant === "outline"
                        ? "bg-gradient-to-t from-neutral-900 to-neutral-600 dark:from-neutral-700 dark:to-neutral-800 shadow-lg shadow-neutral-900 border border-neutral-700 text-white hover:from-neutral-800 hover:to-neutral-700"
                        : "bg-gradient-to-t from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                    }`}
                >
                  {plan.buttonText}
                </button>
                <ul className="space-y-2 font-semibold py-5">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-neutral-800 dark:text-neutral-200 grid place-content-center mt-0.5 mr-3">
                        {feature.icon}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-slate-700">
                  <h4 className="font-medium text-base text-gray-900 dark:text-white mb-3">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2 font-semibold">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="h-6 w-6 bg-green-50 dark:bg-green-900/20 border border-blue-500 rounded-full grid place-content-center mt-0.5 mr-3">
                          <CheckCheck className="h-4 w-4 text-blue-500" />
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </InView>
        ))}
      </div>
    </section>
  );
}

