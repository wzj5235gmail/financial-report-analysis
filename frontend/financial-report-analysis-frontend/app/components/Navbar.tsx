import { FaCaretDown, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

interface NavbarProps {
    username: string | null;
    handleLogout: () => void;
    setIsLoginModalOpen: (open: boolean) => void;
    setIsSignupModalOpen: (open: boolean) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (open: boolean) => void;
    setIsHistoryOpen: (open: boolean) => void;
}

const Navbar = ({ username, handleLogout, setIsLoginModalOpen, setIsSignupModalOpen, isDropdownOpen, setIsDropdownOpen, setIsHistoryOpen }: NavbarProps) => {
    return (
        <nav className="p-4 mb-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <h1 className="text-[#006e90] text-2xl font-bold">Financial Report Analysis</h1>
                <div>
                    {username ? (
                        <div className="relative inline-block text-left">
                            <div>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#41bbd9] text-white hover:bg-[#006e90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#41bbd9] transition duration-300"
                                >
                                    {username} <FaCaretDown className="ml-2" />
                                </button>
                            </div>
                            {isDropdownOpen && (
                                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                        <button
                                            onClick={() => setIsHistoryOpen(true)}
                                            className="block px-4 py-2 text-sm text-[#006e90] hover:bg-[#adcad6] w-full text-left transition duration-300"
                                        >
                                            My History
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block px-4 py-2 text-sm text-[#006e90] hover:bg-[#adcad6] w-full text-left transition duration-300"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="mr-2 px-4 py-2 bg-[#41bbd9] text-white rounded-md hover:bg-[#006e90] transition duration-300"
                            >
                                <FaSignInAlt className="inline mr-1" /> Login
                            </button>
                            <button
                                onClick={() => setIsSignupModalOpen(true)}
                                className="px-4 py-2 bg-[#99c24d] text-white rounded-md hover:bg-[#006e90] transition duration-300"
                            >
                                <FaUserPlus className="inline mr-1" /> Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
