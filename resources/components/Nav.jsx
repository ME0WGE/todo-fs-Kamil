import { useState } from 'react';

export default function Nav() {
    const [darkMode, setDarkMode] = useState(false);
    return (
        <>
            <nav className="flex justify-around">
                <p>ToDoLiiiist</p>
                <button className="cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </nav>
        </>
    );
}
