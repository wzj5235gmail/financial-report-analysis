"use client";

import React, { useState } from "react";
import Modal from "./Modal";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:8000/api/create-user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        onClose();
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-[#006e90]">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-[#006e90]">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-[#adcad6] shadow-sm focus:border-[#41bbd9] focus:ring focus:ring-[#41bbd9] focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-[#006e90]">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-[#adcad6] shadow-sm focus:border-[#41bbd9] focus:ring focus:ring-[#41bbd9] focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#006e90]">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-[#adcad6] shadow-sm focus:border-[#41bbd9] focus:ring focus:ring-[#41bbd9] focus:ring-opacity-50"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#41bbd9] hover:bg-[#006e90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99c24d] transition-colors duration-300"
        >
          Sign Up
        </button>
      </form>
    </Modal>
  );
};

export default SignupModal;
