import { useState } from 'react';
import Footer from '../Footer';
import Nav from '../Nav';

export default function Layout({ children }) {
    const [darkMode, setDarkMode] = useState(true);

    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }

    return (
        <>
            <div className={darkMode ? 'dark' : ''}>
                <div
                    className={`min-h-screen transition-colors duration-300 ${
                        darkMode
                            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white'
                            : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'
                    }`}
                >
                    <Nav darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
                    <main className="flex justify-center">{children}</main>
                    <Footer />
                </div>
            </div>
        </>
    );
}
