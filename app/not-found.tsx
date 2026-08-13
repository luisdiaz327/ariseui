"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 text-center"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,249,223,0.6)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,148,31,0.15)_0%,transparent_60%)]"
      />

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground"
      >
        Error 404
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.6 }}
        className="font-cal text-[clamp(5rem,20vw,14rem)] font-bold leading-none tracking-tight text-foreground"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.5 }}
        className="mt-4 max-w-sm text-balance text-base text-muted-foreground"
      >
        This page does not exist. It may have moved or the URL might be wrong.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.5 }}
        className="mt-8"
      >
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-80"
        >
          Back to home
        </Link>
      </motion.div>
    </motion.main>
  );
}
