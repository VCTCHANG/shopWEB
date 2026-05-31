"use client";
import Link from "next/link";
import { ShoppingBag, Search, Menu } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { EcoToggle } from "@/components/EcoToggle";
import { AuthButton } from "@/components/AuthButton";
export function Header() {
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
    });
    return (
        <motion.header
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="site-header bg-background/80 backdrop-blur-md"
        >

            <div className="container-wide header-inner">

                <button className="btn-text md:hidden">
                    <Menu size={20} />
                </button>
                <Link href="/" className="site-logo">Heirloom.</Link>

                <nav className="nav-desktop hidden md:flex">
                    <Link href="/shop" className="btn-text">Shop</Link>
                    <Link href="/footprint" className="btn-text">Footprint</Link>
                    <Link href="/about" className="btn-text">About</Link>
                </nav>
                <div className="header-actions flex gap-4 items-center">
                    <EcoToggle />
                    <button className="btn-text">
                        <Search size={20} />
                    </button>
                    <button className="btn-text">
                        <ShoppingBag size={20} />
                    </button>
                    <AuthButton />
                </div>
            </div>
        </motion.header>
    )
}