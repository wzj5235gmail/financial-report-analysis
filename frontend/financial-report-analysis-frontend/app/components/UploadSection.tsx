import { FaTimes } from "react-icons/fa";
import { UploadButton } from "./UploadButton";

interface UploadSectionProps {
    uploadedFileName: string;
    clearUpload: () => void;
    handleFileUpload: (file: File) => void;
}

const UploadSection = ({ uploadedFileName, clearUpload, handleFileUpload }: UploadSectionProps) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl mb-6 text-[#006e90] ">
                Upload PDF
            </h2>
            {uploadedFileName ? (
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[#006e90]">{uploadedFileName}</span>
                    <button
                        onClick={clearUpload}
                        className="text-[#f18f01] hover:text-[#006e90] transition-colors duration-300"
                    >
                        <FaTimes />
                    </button>
                </div>
            ) : (
                <UploadButton onUpload={handleFileUpload} />
            )}
        </div>
    )
}

export default UploadSection;