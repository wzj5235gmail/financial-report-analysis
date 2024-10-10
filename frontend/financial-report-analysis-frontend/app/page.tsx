"use client";

import { useState, useEffect } from "react";
import { HistoryList } from "./components/HistoryList";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import Navbar from "./components/Navbar";
import UploadSection from "./components/UploadSection";
import UrlSection from "./components/UrlSection";
import ResultSection from "./components/ResultSection";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const username = localStorage.getItem("username");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch("http://localhost:8000/api/token/verify/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token })
          });
          if (!response.ok) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('username');
        }
      }
    };

    verifyToken();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!localStorage.getItem('token')) {
      setIsLoginModalOpen(true);
      return;
    }
    const response = await fetch("http://localhost:8000/api/token/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: localStorage.getItem('token') })
    });
    if (!response.ok) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setAnalysisResult(data);
      setUploadedFileName(file.name);
    } finally {
      setIsLoading(false);
    }
  };

  const clearUpload = () => {
    setUploadedFileName("");
    setAnalysisResult("");
  };

  const handleUrlSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      setIsLoginModalOpen(true);
      return;
    }
    const response = await fetch("http://localhost:8000/api/token/verify/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: localStorage.getItem('token') })
    });
    if (!response.ok) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/download/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: pdfUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analysis from URL");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-blue-200 py-12 px-4 sm:px-6 lg:px-8 text-[#006e90]">
      <Navbar
        username={username}
        handleLogout={handleLogout}
        setIsLoginModalOpen={setIsLoginModalOpen}
        setIsSignupModalOpen={setIsSignupModalOpen}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setIsHistoryOpen={setIsHistoryOpen}
      />
      <div className="max-w-4xl mx-auto">
        <UploadSection
          uploadedFileName={uploadedFileName}
          clearUpload={clearUpload}
          handleFileUpload={handleFileUpload}
        />
        <UrlSection
          pdfUrl={pdfUrl}
          setPdfUrl={setPdfUrl}
          handleUrlSubmit={handleUrlSubmit}
          isLoading={isLoading}
        />
        <ResultSection
          analysisResult={analysisResult}
          isLoading={isLoading}
        />
        {isHistoryOpen && (
          <HistoryList
            isHistoryOpen={isHistoryOpen}
            setIsHistoryOpen={setIsHistoryOpen}
          />)}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        setIsSignupModalOpen={setIsSignupModalOpen}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
      />
    </div>
  );
}