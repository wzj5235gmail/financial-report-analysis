"use client";

import React, { useState } from "react";
import Modal from "./Modal";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsSignupModalOpen: (isOpen: boolean) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, setIsSignupModalOpen }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.access);
        localStorage.setItem("username", email);
        console.log("Login successful");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4 text-[#006e90]">Login</h2>
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
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#41bbd9] hover:bg-[#006e90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#41bbd9]"
        >
          Login
        </button>
        <button
          onClick={() => {
            onClose();
            setIsSignupModalOpen(true);
          }}
          className="mt-2 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-[#006e90] bg-[#adcad6] hover:bg-[#99c24d] hover:text-white focus:ring-2 focus:ring-offset-2 focus:ring-[#99c24d]"
        >
          Sign up
        </button>
      </form>
    </Modal>
  );
};

export default LoginModal;
