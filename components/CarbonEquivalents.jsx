"use client";

import { motion } from "framer-motion";
import { TreePine, Car, Lightbulb } from "lucide-react";

const EQUIVALENTS = [
    {
        icon: TreePine,
        label: "Tree absorption",
        calc: (kg) => Math.round(kg / 21.77 * 365),
        unit: "days",
        description: "days for one tree to absorb this",
    },
    {
        icon: Car,
        label: "Car travel",
        calc: (kg) => Math.round(kg / 0.21),
        unit: "km",
        description: "km driven in an average car",
    },
    {
        icon: Lightbulb,
        label: "LED usage",
        calc: (kg) => Math.round(kg / 0.005),
        unit: "hrs",
        description: "hours of a 10W LED bulb",
    },
];

export default function CarbonEquivalents({ totalKg, delay = 0 }) {
    if (!totalKg || totalKg <= 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="mt-4"
        >
            <p className="text-xs uppercase tracking-widest text-[#888888] mb-3">
                That&apos;s equivalent to
            </p>
            <div className="grid grid-cols-3 gap-2">
                {EQUIVALENTS.map(({ icon: Icon, label, calc, unit, description }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + 0.1 * i, type: "spring", stiffness: 200 }}
                        className="flex flex-col items-center gap-2 bg-white border border-[#E5E5E5] rounded-xl p-3 text-center"
                        title={description}
                    >
                        <Icon className="w-4 h-4 text-[#888888]" />
                        <span className="font-sans font-semibold text-[#1A1A1A] text-sm leading-none">
                            {calc(totalKg).toLocaleString()}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-[#888888]">{unit}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
