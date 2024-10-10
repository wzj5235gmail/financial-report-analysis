import Modal from "./Modal";

const AnalysisResultModal = ({ isOpen, onClose, html }: { isOpen: boolean, onClose: () => void, html: string }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} width="max-w-4xl">
            <div className="prose max-w-none text-black" dangerouslySetInnerHTML={{ __html: html }} />
        </Modal>
    )
}

export default AnalysisResultModal;