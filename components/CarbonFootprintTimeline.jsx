"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TreePine, Factory, Ship, Plane, Truck, Package, Leaf, Loader2 } from "lucide-react";
import CarbonEquivalents from "@/components/CarbonEquivalents";

const getTransportIcon = (method) => {
    switch (method) {
        case "Sea": return <Ship className="w-5 h-5" />;
        case "Air": return <Plane className="w-5 h-5" />;
        default: return <Truck className="w-5 h-5" />;
    }
};

// Counter animation component
const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime;
        const duration = 1000; // 1 second
        const startValue = 0;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            // easeOutQuart
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const current = startValue + (value - startValue) * easeOut;
            
            setDisplayValue(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{displayValue.toFixed(2)}</span>;
};

export default function CarbonFootprintTimeline({ calcParams }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCarbonData = async () => {
            try {
                const response = await fetch('/api/carbon', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(calcParams)
                });
                const result = await response.json();
                if (result.success) {
                    setData(result);
                } else {
                    setError(true);
                }
            } catch (e) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchCarbonData();
    }, [calcParams]);

    if (error) {
        return <div className="text-red-500 text-sm mt-4">Failed to load carbon footprint data.</div>;
    }

    return (
        <div className="mt-8 border border-[#E5E5E5] rounded-2xl p-6 bg-[#FAFAFA]">
            <div className="flex items-center gap-2 mb-6 border-b border-[#E5E5E5] pb-4">
                <Leaf className="w-5 h-5 text-green-600" />
                <h3 className="font-serif text-lg text-[#1A1A1A]">Lifecycle Carbon Tracker</h3>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                    <Loader2 className="w-6 h-6 animate-spin text-[#888888] mb-4" />
                    <span className="text-xs uppercase tracking-widest text-[#888888]">Analyzing supply chain...</span>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Timeline Steps */}
                    <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E5E5E5] before:to-transparent">
                        
                        {/* Step 1: Raw Materials */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative flex items-center justify-between"
                        >
                            <div className="absolute left-[-24px] bg-[#FAFAFA] p-1"><TreePine className="w-4 h-4 text-[#888888]" /></div>
                            <span className="text-sm text-[#888888] ml-4">Raw Materials ({calcParams.materialComplexity})</span>
                            <span className="font-sans text-sm font-medium text-[#1A1A1A]"><AnimatedNumber value={data.breakdown.rawMaterials} /> kg</span>
                        </motion.div>

                        {/* Step 2: Manufacturing */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="relative flex items-center justify-between"
                        >
                            <div className="absolute left-[-24px] bg-[#FAFAFA] p-1"><Factory className="w-4 h-4 text-[#888888]" /></div>
                            <span className="text-sm text-[#888888] ml-4">Manufacturing</span>
                            <span className="font-sans text-sm font-medium text-[#1A1A1A]"><AnimatedNumber value={data.breakdown.manufacturing} /> kg</span>
                        </motion.div>

                        {/* Step 3: Transportation */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.0 }}
                            className="relative flex items-center justify-between"
                        >
                            <div className="absolute left-[-24px] bg-[#FAFAFA] p-1">{getTransportIcon(calcParams.transportMethod)}</div>
                            <span className="text-sm text-[#888888] ml-4">Transport ({calcParams.origin})</span>
                            <span className="font-sans text-sm font-medium text-[#1A1A1A]"><AnimatedNumber value={data.breakdown.transportation} /> kg</span>
                        </motion.div>

                        {/* Step 4: Packaging */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4 }}
                            className="relative flex items-center justify-between"
                        >
                            <div className="absolute left-[-24px] bg-[#FAFAFA] p-1"><Package className="w-4 h-4 text-[#888888]" /></div>
                            <span className="text-sm text-[#888888] ml-4">Packaging ({calcParams.packaging})</span>
                            <span className="font-sans text-sm font-medium text-[#1A1A1A]"><AnimatedNumber value={data.breakdown.packaging} /> kg</span>
                        </motion.div>
                    </div>

                    {/* Total Result */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8, type: "spring" }}
                        className="mt-6 bg-[#1A1A1A] text-white rounded-xl p-4 flex items-center justify-between shadow-lg"
                    >
                        <span className="text-xs uppercase tracking-widest text-[#A0A0A0]">Total Impact</span>
                        <div className="flex items-baseline gap-1">
                            <span className="font-serif text-2xl text-green-400"><AnimatedNumber value={data.total} /></span>
                            <span className="text-xs text-[#A0A0A0]">{data.unit}</span>
                        </div>
                    </motion.div>

                    <CarbonEquivalents totalKg={data.total} delay={2.2} />
                </div>
            )}
        </div>
    );
}
