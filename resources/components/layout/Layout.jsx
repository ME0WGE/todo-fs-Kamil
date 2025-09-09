import { useState } from 'react';
import Footer from '../Footer';
import Nav from '../Nav';

export default function Layout({ children }) {
    const [darkMode, setDarkMode] = useState(true);

    function toggleDarkMode() {
        setDarkMode(!darkMode);
    }

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div
                className={`min-h-screen transition-colors duration-300 ${
                    darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                }`}
            >
                <Nav darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
                <main className="flex justify-center">{children}</main>
                <Footer />
            </div>
        </div>
    );
}
