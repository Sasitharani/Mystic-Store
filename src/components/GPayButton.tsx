import { motion } from "motion/react";

interface GPayButtonProps {
  onClick: () => void;
}

export default function GPayButton({ onClick }: GPayButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-black text-white h-[60px] rounded-[4px] flex items-center justify-center gap-2 group transition-all"
    >
      <img 
        src="https://www.gstatic.com/instantbuy/svg/dark_gpay.svg" 
        alt="Google Pay" 
        className="h-6"
      />
      <span className="sr-only">Pay with Google Pay</span>
    </motion.button>
  );
}
