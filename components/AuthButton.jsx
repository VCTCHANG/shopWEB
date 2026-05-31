"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return <span className="inline-block w-10 h-3 bg-border animate-pulse" />;
  }

  if (session?.user) {
    const displayName =
      session.user.name || session.user.email?.split("@")[0] || "Account";

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="btn-text flex items-center gap-2"
          aria-label="Account menu"
        >
          <User size={18} />
          <span className="hidden md:inline">{displayName}</span>
        </button>

        {open && (
          <div className="absolute right-0 top-9 z-50 bg-background border border-border min-w-[200px] py-4 px-5 shadow-sm">
            <p className="text-xs text-muted uppercase tracking-widest mb-4 truncate">
              {session.user.email}
            </p>
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="btn-text flex items-center gap-2 w-full text-left"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href="/auth/login" className="btn-text">
      Login
    </Link>
  );
}
