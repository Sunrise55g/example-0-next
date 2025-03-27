"use client";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useTheme } from "next-themes";



const ThemeSwitcher: NextPage = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const IconText = resolvedTheme === "light" ? "LIGHT" : "DARK";

  return (
    <button
      type="button"
      aria-label="Theme Switcher"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="flex items-center outline-none rounded text-slate-600 hover:bg-slate-600 hover:text-white dark:text-white dark:hover:bg-slate-200 dark:hover:text-black"
    >
      {IconText}
    </button>
  );
};

export default ThemeSwitcher;
