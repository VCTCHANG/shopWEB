"use client";

import Link from "next/link";
import { TreePine, Car, Lightbulb, ArrowRight, ArrowUpRight, Leaf, Globe, BarChart3 } from "lucide-react";
import { products } from "@/lib/data";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function parseKg(str) {
    const match = str.match(/^(\d+\.?\d*)\s*kg/);
    return match ? parseFloat(match[1]) : null;
}

const EQUIV = [
    { icon: TreePine,  label: "樹木天數", calc: (kg) => Math.round(kg / 21.77 * 365), unit: "天",  tip: "一棵樹需要幾天才能吸收這些碳排放", color: "text-green-600", bg: "bg-green-50",  border: "border-green-100" },
    { icon: Car,       label: "開車里程", calc: (kg) => Math.round(kg / 0.21),         unit: "公里", tip: "相當於一般汽車行駛的距離",        color: "text-blue-500",  bg: "bg-blue-50",   border: "border-blue-100"  },
    { icon: Lightbulb, label: "LED 燈泡", calc: (kg) => Math.round(kg / 0.005),        unit: "小時", tip: "10W LED 燈泡的使用時間",          color: "text-amber-500", bg: "bg-amber-50",  border: "border-amber-100" },
];

function GradeTag({ kg }) {
    if (kg === null) return null;
    if (kg <= 0.5) return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 tracking-wider">A 極低</span>;
    if (kg <= 2)   return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-lime-100 text-lime-700 border border-lime-200 tracking-wider">B 低</span>;
    if (kg <= 5)   return <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 tracking-wider">C 中</span>;
    return             <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200 tracking-wider">D 較高</span>;
}

// 3D tilt card
function TiltCard({ children, className = "" }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rx = useSpring(useTransform(y, [-0.5, 0.5], ["6deg", "-6deg"]), { stiffness: 300, damping: 30 });
    const ry = useSpring(useTransform(x, [-0.5, 0.5], ["-6deg", "6deg"]), { stiffness: 300, damping: 30 });
    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => { x.set(0); y.set(0); };
    return (
        <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: "900px" }} className="h-full">
            <motion.div style={{ rotateX: rx, rotateY: ry }} className={`h-full ${className}`}>
                {children}
            </motion.div>
        </div>
    );
}

// Animated counter
function CountUp({ to, duration = 1400 }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    useEffect(() => {
        if (!inView) return;
        let start;
        const tick = (now) => {
            if (!start) start = now;
            const p = Math.min((now - start) / duration, 1);
            setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, to, duration]);
    return <span ref={ref}>{val.toLocaleString()}</span>;
}

// Floating decoration
function Orb({ className }) {
    return (
        <motion.div
            className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
            animate={{ y: [0, -24, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
    );
}

export default function FootprintPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

    const sorted = [...products]
        .map((p) => ({ ...p, kg: parseKg(p.carbonFootprint) }))
        .sort((a, b) => {
            if (a.kg === null) return 1;
            if (b.kg === null) return -1;
            return a.kg - b.kg;
        });

    const maxKg = Math.max(...sorted.map((p) => p.kg ?? 0));
    const valid = sorted.filter(p => p.kg !== null);
    const avgKg = parseFloat((valid.reduce((s, p) => s + p.kg, 0) / valid.length).toFixed(1));

    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] overflow-x-hidden">

            {/* ══════════════════════════════
                HERO — editorial, left-aligned
            ══════════════════════════════ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-[0.045]"
                    style={{ backgroundImage: "radial-gradient(#1A1A1A 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <Orb className="w-[500px] h-[500px] bg-green-200/50 -top-20 -right-40" />
                <Orb className="w-80 h-80 bg-blue-100/40 bottom-20 left-1/3" />

                <motion.div style={{ y: heroY, opacity: heroOpacity }}
                    className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 pt-32 pb-20 flex flex-col md:flex-row md:items-end gap-16"
                >
                    {/* Left: text */}
                    <div className="flex-1">
                        <motion.p
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-[11px] uppercase tracking-[0.25em] text-[#AAAAAA] mb-8"
                        >
                            碳足跡透明化計畫 · SDG 12
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="font-serif leading-[0.9] mb-10 text-[#1A1A1A]"
                            style={{ fontSize: "clamp(4rem, 10vw, 8.5rem)", letterSpacing: "-0.04em" }}
                        >
                            Nothing is<br />
                            <em className="text-[#CCCCCC] not-italic font-serif italic">weightless.</em>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.7 }}
                            className="text-[#888888] max-w-sm leading-[1.85] text-sm mb-12"
                        >
                            我們追蹤每件商品從原料採集、生產製造到運輸配送的完整碳排放，
                            並將數字轉換成你我都能理解的日常語言。
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="flex items-center gap-6 flex-wrap"
                        >
                            {EQUIV.map(({ icon: Icon, label, color }) => (
                                <div key={label} className="flex items-center gap-2 text-[#BBBBBB]">
                                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                                    <span className="text-[11px] tracking-widest uppercase">{label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: big avg stat */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="shrink-0 flex flex-col items-center md:items-end gap-3 md:pb-4"
                    >
                        <div className="relative w-52 h-52 md:w-64 md:h-64 flex items-center justify-center">
                            {/* Decorative rings */}
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border border-dashed border-[#E0E0E0]" />
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-6 rounded-full border border-dashed border-[#EBEBEB]" />
                            <div className="absolute inset-12 rounded-full bg-white shadow-lg border border-[#F0F0F0] flex flex-col items-center justify-center gap-0.5">
                                <span className="text-[10px] uppercase tracking-widest text-[#AAAAAA]">系列平均</span>
                                <span className="font-serif text-3xl text-[#1A1A1A] leading-none">{avgKg}</span>
                                <span className="text-[9px] text-[#AAAAAA]">kg CO₂e</span>
                            </div>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-[#CCCCCC]">平均碳排放量</p>
                    </motion.div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
                >
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
                        className="w-px h-14 bg-gradient-to-b from-[#CCCCCC] to-transparent" />
                </motion.div>
            </section>

            {/* ══════════════════════════
                BLACK STATS BAND
            ══════════════════════════ */}
            <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#1A1A1A] py-14"
            >
                <div className="max-w-4xl mx-auto px-8 grid grid-cols-3 divide-x divide-white/10">
                    {[
                        { num: 12, suffix: "", label: "件永續商品", sub: "完整碳足跡揭露" },
                        { num: 100, suffix: "%", label: "透明度承諾", sub: "從原料到包裝全追蹤" },
                        { num: 3,  suffix: "", label: "種等效換算", sub: "讓數字變得有感" },
                    ].map(({ num, suffix, label, sub }, i) => (
                        <motion.div key={label}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center gap-1 px-8 text-center"
                        >
                            <div className="font-serif text-4xl md:text-5xl text-white leading-none mb-1">
                                <CountUp to={num} />{suffix}
                            </div>
                            <div className="text-sm text-white/60">{label}</div>
                            <div className="text-[10px] text-white/25 uppercase tracking-wider mt-1">{sub}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ══════════════════════════
                AVG PRODUCT EQUIVALENTS
            ══════════════════════════ */}
            <section className="py-24 px-8 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#AAAAAA] mb-4">以本系列平均碳排放（{avgKg} kg）換算</p>
                    <p className="font-serif italic text-3xl md:text-4xl text-[#1A1A1A]">這些數字，代表什麼？</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {EQUIV.map(({ icon: Icon, label, calc, unit, tip, color, bg, border }, i) => (
                        <motion.div key={label}
                            initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.13, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <TiltCard className={`border ${border} rounded-3xl p-8 bg-white flex flex-col gap-5 shadow-sm hover:shadow-xl transition-shadow duration-500`}>
                                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${color}`} />
                                </div>
                                <div>
                                    <div className="font-serif text-5xl text-[#1A1A1A] leading-none mb-1">
                                        <CountUp to={calc(avgKg)} duration={1600} />
                                    </div>
                                    <div className={`text-sm font-medium ${color} tracking-wide`}>{unit}</div>
                                </div>
                                <div className="mt-auto border-t border-[#F0F0F0] pt-4">
                                    <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{label}</p>
                                    <p className="text-xs text-[#AAAAAA] leading-relaxed">{tip}</p>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════
                PRODUCT RANKING
            ══════════════════════════ */}
            <section className="bg-white border-t border-[#E5E5E5] py-20 px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
                        <div>
                            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                className="text-[11px] uppercase tracking-[0.25em] text-[#AAAAAA] mb-3">
                                商品碳排放排名
                            </motion.p>
                            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: 0.1 }}
                                className="font-serif italic text-3xl md:text-4xl text-[#1A1A1A]">
                                從低到高，誠實呈現
                            </motion.p>
                        </div>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex gap-6 text-[11px] uppercase tracking-wider text-[#AAAAAA]">
                            {EQUIV.map(({ icon: Icon, label, color }) => (
                                <span key={label} className="flex items-center gap-1.5">
                                    <Icon className={`w-3 h-3 ${color}`} />{label}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    <div>
                        {sorted.map((product, i) => {
                            const kg = product.kg;
                            const barWidth = kg !== null ? (kg / maxKg) * 100 : 0;
                            const isNeg = product.carbonFootprint.toLowerCase().includes("negative");

                            return (
                                <motion.div key={product.id}
                                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-30px" }}
                                    transition={{ delay: i * 0.035, duration: 0.45 }}
                                >
                                    <Link href={`/shop/${product.id}`}
                                        className="group flex items-center gap-4 py-4 border-b border-[#D8D8D8] hover:border-[#CCCCCC] hover:scale-[1.018] hover:bg-white hover:shadow-sm hover:px-4 hover:-mx-4 hover:rounded-xl transition-all duration-300"
                                    >
                                        {/* Rank */}
                                        <span className="font-mono text-[11px] text-[#888888] w-7 shrink-0 tabular-nums">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>

                                        {/* Grade */}
                                        <div className="w-14 shrink-0">
                                            {isNeg
                                                ? <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 tracking-wider">碳負排</span>
                                                : <GradeTag kg={kg} />}
                                        </div>

                                        {/* Name */}
                                        <div className="flex-1 min-w-0">
                                            <span className="font-serif italic text-[#1A1A1A] group-hover:text-[#666666] transition-colors duration-200 block truncate text-[15px]">
                                                {product.name}
                                            </span>
                                            <span className="text-[10px] text-[#CCCCCC] mt-0.5 block">
                                                {isNeg ? "碳封存量大於排放量" : kg !== null ? `${kg} kg CO₂e` : "—"}
                                            </span>
                                        </div>

                                        {/* Bar + equiv */}
                                        <div className="hidden lg:flex flex-col gap-2 w-64 shrink-0">
                                            {isNeg ? (
                                                <div className="h-1 w-full bg-green-100 rounded-full overflow-hidden">
                                                    <div className="h-full w-full bg-green-400 rounded-full" />
                                                </div>
                                            ) : kg !== null ? (
                                                <>
                                                    <div className="relative h-1 bg-[#F0F0F0] rounded-full overflow-hidden">
                                                        <motion.div className="absolute inset-y-0 left-0 bg-[#1A1A1A] rounded-full"
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${barWidth}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 + i * 0.03 }}
                                                        />
                                                    </div>
                                                    <div className="flex gap-6">
                                                        {EQUIV.map(({ icon: Icon, label, calc, unit, color }) => (
                                                            <div key={label} className="flex items-center gap-1">
                                                                <Icon className={`w-2.5 h-2.5 ${color} shrink-0`} />
                                                                <span className="text-[10px] text-[#888888] font-medium tabular-nums">{calc(kg).toLocaleString()}</span>
                                                                <span className="text-[9px] text-[#CCCCCC]">{unit}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>

                                        <ArrowUpRight className="w-4 h-4 text-[#DDDDDD] shrink-0 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-200" />
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════
                METHODOLOGY
            ══════════════════════════ */}
            <section className="bg-[#1A1A1A] py-20 px-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 mb-5">計算方法</p>
                        <p className="text-white/60 text-sm leading-[2]">
                            碳足跡涵蓋原料取得、製造加工、運輸配送與包裝四個生命週期階段，
                            依據重量、產地、運輸方式與材料複雜度動態計算。
                        </p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 mb-5">換算依據</p>
                        <ul className="space-y-4 text-sm text-white/50">
                            <li className="flex items-start gap-3">
                                <TreePine className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                <span>一棵樹每年吸收約 <strong className="text-white/80">21.77 kg</strong> CO₂</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Car className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <span>一般汽車每公里排放約 <strong className="text-white/80">0.21 kg</strong> CO₂</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>10W LED 燈泡每小時排放約 <strong className="text-white/80">0.005 kg</strong> CO₂</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </section>

        </main>
    );
}
