"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ClipboardList, ImagePlus, Menu, Plus } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  className?: string;
}

const menuItems = [
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => <Menu {...props} />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => <Plus {...props} />,
    label: "Registros",
    href: "/dashboard/registration",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <ClipboardList {...props} />
    ),
    label: "Historicos",
    href: "/dashboard/history",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => <ImagePlus {...props} />,
    label: "Galeria",
    href: "/dashboard/gallery",
  },
];

export function MenuBar({ className }: MenuBarProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, width: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex !== null && menuRef.current && tooltipRef.current) {
      const menuItem = menuRef.current.children[activeIndex] as HTMLElement;
      const menuRect = menuRef.current.getBoundingClientRect();
      const itemRect = menuItem.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      const left =
        itemRect.left -
        menuRect.left +
        (itemRect.width - tooltipRect.width) / 2;

      setTooltipPosition({
        left: Math.max(0, Math.min(left, menuRect.width - tooltipRect.width)),
        width: tooltipRect.width,
      });
    }
  }, [activeIndex]);

  return (
    <div className="relative">
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute left-0 right-0"
            style={{
              top: "-31px",
              pointerEvents: "none",
              zIndex: 50,
            }}
          >
            <motion.div
              ref={tooltipRef}
              className="h-7 px-3 bg-[#131316] rounded-lg shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.20)] shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.20)] shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.24)] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.24)] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.24)] shadow-[0px_0px_0px_1px_rgba(0,0,0,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.05)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.12)] justify-center items-center inline-flex overflow-hidden"
              initial={{ x: tooltipPosition.left }}
              animate={{ x: tooltipPosition.left }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ width: "auto" }}
            >
              <p className="text-white/80 text-[13px] font-medium font-['Geist'] leading-tight whitespace-nowrap">
                {menuItems[activeIndex].label}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={menuRef}
        className="h-10 px-1.5 bg-[#131316] rounded-[99px] shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.20)] shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.20)] shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.24)] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.24)] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.24)] shadow-[0px_0px_0px_1px_rgba(0,0,0,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.08)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.20)] justify-center items-center gap-[3px] inline-flex overflow-hidden z-10"
      >
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href || "#"}>
            <Button
              key={index}
              className="w-12 h-16 px-3 py-1 justify-center items-center gap-2 flex hover:bg-[hsla(0,0%,100%,0.08)] transition-colors"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="justify-center items-center rounded-full flex">
                <div className="w-[16px] h-[16px] flex justify-center items-center overflow-hidden">
                  <item.icon className="w-full h-full text-[#fafafb]" />
                </div>
              </div>
              <span className="sr-only">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
