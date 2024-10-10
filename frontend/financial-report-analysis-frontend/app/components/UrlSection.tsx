interface UrlSectionProps {
    pdfUrl: string;
    setPdfUrl: (url: string) => void;
    handleUrlSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

const UrlSection = ({ pdfUrl, setPdfUrl, handleUrlSubmit, isLoading }: UrlSectionProps) => {
    return (
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl mb-6 text-[#006e90]">
                Provide PDF URL
            </h2>
            <form onSubmit={handleUrlSubmit} className="flex">
                <input
                    type="url"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="Enter PDF URL"
                    className="flex-grow px-4 py-3 border border-[#adcad6] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#41bbd9] transition-all duration-300 text-[#006e90] shadow-md"
                    required
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-[#41bbd9] text-white rounded-r-lg hover:bg-[#006e90] focus:outline-none focus:ring-2 focus:ring-[#41bbd9] transition-all duration-300"
                    disabled={isLoading}
                >
                    {isLoading ? "Analyzing..." : "Analyze"}
                </button>
            </form>
        </div>

    )
}

export default UrlSection;