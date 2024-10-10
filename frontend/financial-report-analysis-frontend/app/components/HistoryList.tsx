import React, { useEffect, useState } from "react";
import AnalysisResultModal from "./AnalysisResultModal";

interface HistoryItem {
  id: number;
  financial_report: {
    file_name: string;
  };
  owner: number;
  created_at: string;
}

interface HistoryListProps {
  isHistoryOpen: boolean;
  setIsHistoryOpen: (open: boolean) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ isHistoryOpen, setIsHistoryOpen }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/history")
      .then((response) => response.json())
      .then((data) => {
        setHistory(data);
      });
  }, []);

  const handleViewAnalysis = (id: number) => {
    fetch(`http://localhost:8000/api/financial-reports-analysis/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setAnalysisResult(data.analysis);
        setIsAnalysisModalOpen(true);
      });
  };

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-8 mb-8 transition-all duration-300 hover:shadow-xl">
      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">File Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Analysis</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {history.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(item.created_at).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{item.financial_report.file_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <button onClick={() => handleViewAnalysis(item.id)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200">
                  View Analysis
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setIsHistoryOpen(false)} className="mt-4 bg-[#41bbd9] text-white px-4 py-2 rounded-md hover:bg-[#006e90] transition-colors duration-300">Hide History</button>
      <AnalysisResultModal isOpen={isAnalysisModalOpen} onClose={() => setIsAnalysisModalOpen(false)} html={analysisResult} />
    </div>

  );
};
