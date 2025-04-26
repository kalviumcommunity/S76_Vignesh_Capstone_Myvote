import { useRef, useState } from "react";
import {
  IconHome2,
  IconCheckupList,
  IconLogin,
  IconChartBar,
  IconInfoCircle,
  IconLayoutNavbarCollapse,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "../lib/utils"

const items = [
  { title: "Home", href: "/", icon: <IconHome2 /> },
  { title: "Vote", href: "#vote", icon: <IconCheckupList /> },
  { title: "Login", href: "login", icon: <IconLogin /> },
  { title: "Result", href: "#result", icon: <IconChartBar /> },
  { title: "About Us", href: "#about", icon: <IconInfoCircle /> },
];


export const FloatingDock = ({ desktopClassName, mobileClassName }) => {
  return (
    <>
      <FloatingDockDesktop className={desktopClassName} />
      <FloatingDockMobile className={mobileClassName} />
    </>
  );
};


const FloatingDockMobile = ({ className }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 block md:hidden z-50", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layout
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2 items-center"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { delay: idx * 0.05 },
                }}
                transition={{
                  delay: (items.length - 1 - idx) * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <a
                  href={item.href}
                  className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center"
                >
                  <div className="text-neutral-800 dark:text-white">{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center"
      >
        <IconLayoutNavbarCollapse className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
      </button>
    </div>
  );
};


const FloatingDockDesktop = ({ className }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="w-full flex justify-center fixed bottom-6 left-0 z-50">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={cn(
          "hidden md:flex h-16 gap-4 items-end rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 pb-3 shadow-lg",
          className
        )}
      >
        {items.map((item) => (
          <IconContainer mouseX={mouseX} key={item.title} {...item} />
        ))}
      </motion.div>
    </div>
  );
};


function IconContainer({ mouseX, title, icon, href }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const widthIcon = useSpring(widthTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });
  const heightIcon = useSpring(heightTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-blue-800 dark:border-blue-800 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-neutral-800 dark:text-white"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
