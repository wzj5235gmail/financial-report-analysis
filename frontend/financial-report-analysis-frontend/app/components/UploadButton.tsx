"use client";

import React, { useRef } from "react";

interface UploadButtonProps {
  onUpload: (file: File) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        style={{ display: "none" }}
      />
      <button
        onClick={handleClick}
        className="inline-flex items-center px-4 py-2 bg-[#41bbd9] text-white rounded-md hover:bg-[#006e90] focus:outline-none focus:ring-2 focus:ring-[#adcad6] transition-colors duration-300"
      >
        Upload PDF
      </button>
    </div>
  );
};
