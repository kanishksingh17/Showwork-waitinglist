"use client";
import { Timeline } from "@/components/ui/timeline";
import React from "react";

export function ShowWorkTimeline() {
    const data = [
        {
            title: "Step 1 — Upload Your Project",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Simply drag and drop your project files or connect your GitHub repository.
                        ShowWork automatically analyzes the codebase to understand the tech stack and architecture.
                    </p>
                    <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg transform scale-100 sm:scale-125 origin-center">
                        <img
                            src="/timeline-step1.png"
                            alt="ShowWork Projects Dashboard"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Step 2 — Choose Your Template",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Select from 50+ professionally designed templates that highlight your
                        specific skills. Whether you're a frontend, backend, or full-stack dev,
                        we have the perfect layout for you.
                    </p>
                    <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg transform scale-100 sm:scale-125 origin-center">
                        <img
                            src="/timeline-step2.png"
                            alt="Choose Your Domain and Template"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Step 3 — AI Generates Content",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Our AI generates professional descriptions, technical challenges resolved,
                        and key features. You can edit the tone from "Professional" to "Casual" or "Storyteller".
                    </p>
                    <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg transform scale-100 sm:scale-125 origin-center">
                        <img
                            src="/timeline-step3.png"
                            alt="AI Generated Portfolio Preview"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Step 4 — Fine-tune Your Brand",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        Customize colors, fonts, and themes to match your personal brand.
                        Our live preview lets you see changes in real-time as you tweak your design.
                    </p>
                    <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg transform scale-100 sm:scale-125 origin-center">
                        <img
                            src="/timeline-step4.png"
                            alt="Content Management Dashboard"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            ),
        },
        {
            title: "Step 5 — Multi-Platform Publishing",
            content: (
                <div>
                    <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
                        With one click, publish your new portfolio piece to your personal site,
                        LinkedIn, and Twitter simultaneously. Reach your audience where they are.
                    </p>
                    <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-lg transform scale-100 sm:scale-125 origin-center">
                        <img
                            src="/timeline-step5.png"
                            alt="Multi-Platform Integrations"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="w-full">
            <Timeline data={data} />
        </div>
    );
}
