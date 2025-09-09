export default function Nav({ darkMode, onToggleDarkMode }) {
    return (
        <>
            <nav className="flex justify-around p-4">
                <p className="text-xl font-bold">ToDoLiiiist</p>
                <button
                    className="cursor-pointer p-2 rounded-lg transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    onClick={onToggleDarkMode}
                >
                    <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
                </button>
            </nav>
        </>
    );
}
