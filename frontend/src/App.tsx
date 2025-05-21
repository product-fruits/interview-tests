import React, { useState } from 'react';
import { BrowserRouter as Router, NavLink, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Items from './pages/Items';
import { TourEngine } from './tour-engine';

const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (<>
        <TourEngine />
        <Router>
            <div className={darkMode ? 'dark' : ''}>
                <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
                    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center">
                        <div className="flex space-x-4">
                            <NavLink to="/" className={({ isActive }) =>
                                `text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                px-3 py-2 rounded-md text-sm font-medium 
                ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : ''}`
                            }>
                                Home
                            </NavLink>
                            <NavLink to="/items" id="nav-items" className={({ isActive }) =>
                                `text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white 
                px-3 py-2 rounded-md text-sm font-medium 
                ${isActive ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : ''}`
                            }>
                                Items
                            </NavLink>
                        </div>
                        <button
                            id="dark-mode-toggle"
                            onClick={toggleDarkMode}
                            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </nav>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/items" element={<Items />} />
                    </Routes>
                </div>
            </div>
        </Router>
    </>
    );
};

export default App; 