import AnalysisResult from "./AnalysisResult"

interface ResultSectionProps {
    analysisResult: string;
    isLoading: boolean;
}

const ResultSection = ({ analysisResult, isLoading }: ResultSectionProps) => {
    return (
        <>
            {isLoading && (
                <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-2xl mb-6 text-[#006e90]">
                        Analyzing...
                    </h2>
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#41bbd9]"></div>
                    </div>
                </div>
            )}

            {!isLoading && analysisResult && (
                <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-2xl mb-6 text-[#006e90]">
                        Analysis Result
                    </h2>
                    <AnalysisResult html={analysisResult} />
                </div>
            )}

        </>
    )
}

export default ResultSection;