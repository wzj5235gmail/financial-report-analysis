const AnalysisResult = ({ html }: { html: string }) => {
    return (
        <div>
            <div className="prose max-w-none text-black" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    )
}

export default AnalysisResult;
