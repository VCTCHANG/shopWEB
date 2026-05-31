"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useRef, useEffect } from "react";

function useMouseParallax() {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, { stiffness: 50, damping: 18 });
    const y = useSpring(rawY, { stiffness: 50, damping: 18 });
    useEffect(() => {
        const fn = (e) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("mousemove", fn);
        return () => window.removeEventListener("mousemove", fn);
    }, [rawX, rawY]);
    return { x, y };
}

function MagneticLink({ href, className, children }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 16 });
    const sy = useSpring(y, { stiffness: 200, damping: 16 });
    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
    };
    const onLeave = () => { x.set(0); y.set(0); };
    return (
        <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
            <Link href={href} className={className}>{children}</Link>
        </motion.div>
    );
}

export default function Home() {
    const { x: mouseX, y: mouseY } = useMouseParallax();
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 500], ["0%", "15%"]);

    const titleRX = useTransform(mouseY, [-1, 1], ["4deg", "-4deg"]);
    const titleRY = useTransform(mouseX, [-1, 1], ["-4deg", "4deg"]);

    const orb1X = useTransform(mouseX, [-1, 1], [-30, 30]);
    const orb1Y = useTransform(mouseY, [-1, 1], [-20, 20]);
    const orb2X = useTransform(mouseX, [-1, 1], [20, -20]);
    const orb2Y = useTransform(mouseY, [-1, 1], [15, -15]);
    const orb3X = useTransform(mouseX, [-1, 1], [-15, 15]);
    const orb3Y = useTransform(mouseY, [-1, 1], [-25, 25]);

    return (
        <main className="hero-section relative overflow-hidden">

            {/* Background */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.045]"
                    style={{ backgroundImage: "radial-gradient(#1A1A1A 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                <motion.div style={{ x: orb1X, y: orb1Y }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-[500px] h-[500px] rounded-full bg-green-100/70 blur-[110px] -top-20 -left-32"
                />
                <motion.div style={{ x: orb2X, y: orb2Y }}
                    animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.45, 0.25] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute w-[420px] h-[420px] rounded-full bg-blue-100/60 blur-[100px] -bottom-10 -right-20"
                />
                <motion.div style={{ x: orb3X, y: orb3Y }}
                    animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.35, 0.2] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute w-[300px] h-[300px] rounded-full bg-amber-50/80 blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">

                <motion.p
                    initial={{ opacity: 0, letterSpacing: "0.5em" }}
                    animate={{ opacity: 1, letterSpacing: "0.2em" }}
                    transition={{ duration: 1.2, delay: 0.15 }}
                    className="hero-meta"
                >
                    Est. 2026 — Workshop inspired by SDG12.
                </motion.p>

                <motion.div
                    style={{ rotateX: titleRX, rotateY: titleRY, transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.04, transition: { duration: 0.15, ease: "easeOut" } }}
                >
                    <h1 className="hero-title cursor-default" style={{ textShadow: "0 20px 60px rgba(0,0,0,0.06)" }}>
                        Heirloom.<br />
                        <span className="hero-highlight">Select.</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.75 }}
                    className="hero-subtitle"
                >
                    A curated selection for sustainable living.
                    <br />Designed to disappear, built to last.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.05 }}
                    className="hero-actions"
                >
                    <MagneticLink href="/shop" className="btn-solid">
                        Discover Collection
                    </MagneticLink>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-px h-14 bg-gradient-to-b from-[#BBBBBB] to-transparent mx-auto"
                />
            </motion.div>

        </main>
    );
}
