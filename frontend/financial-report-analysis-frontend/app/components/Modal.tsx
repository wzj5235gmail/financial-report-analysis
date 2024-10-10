"use client";

import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string; // Add width prop
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, width = "max-w-md" }) => { // Default width to max-w-md
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0"
        }`}
      onClick={handleOutsideClick}
    >
      <div
        className={`relative p-8 bg-white w-full ${width} m-auto flex-col flex rounded-lg transition-all duration-300 ease-in-out ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
      >
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={onClose}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
