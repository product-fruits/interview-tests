import React from 'react';

const Home: React.FC = () => {
    // Static home page; item creation is handled on Items page

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8 transition-all duration-300 hover:shadow-xl">
                <h1 id="home-title" className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
                    Welcome to Juicy Test Tour Demo
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-300 mb-8">
                    This demonstration shows how the Juicy Test tour widget guides users through your application.
                </p>
                {/* Create New Item button removed; use Items page to add items */}
            </div>
        </div>
    );
};

export default Home; 