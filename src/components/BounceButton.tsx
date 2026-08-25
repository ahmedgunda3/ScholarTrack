import React from 'react';
import { motion } from 'framer-motion';

interface BounceButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const BounceButton = ({ onClick, children, className = '' }: BounceButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.06, y: -2 }}
    whileTap={{ scale: 0.92, y: 2 }}
    transition={{ type: "spring", stiffness: 450, damping: 15 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-xl bg-purple-600 font-semibold text-white shadow-lg ${className}`}
  >
    {children}
  </motion.button>
);
