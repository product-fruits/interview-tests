import React, { useState, useEffect } from 'react';

const Items: React.FC = () => {
    const [items, setItems] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const addItem = () => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setItems(prev => [...prev, `Item ${prev.length + 1}`]);
            setIsLoading(false);
        }, 500);
    };

    useEffect(() => {
        // Simulate server fetch on mount, including Home-triggered new item
        const timer = setTimeout(() => {
            const initial = ['Apple', 'Banana'];
            if (sessionStorage.getItem('addNewItem') === 'true') {
                sessionStorage.removeItem('addNewItem');
                initial.push(`Item ${initial.length + 1}`);
            }
            setItems(initial);
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">Your Items</h1>

                <div className="mb-8">
                    <button
                        onClick={addItem}
                        disabled={isLoading}
                        id="add-item-btn"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-indigo-400"
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Add New Item'}
                    </button>
                </div>
                {isLoading ? (
                    <div className="text-gray-500">Loading items...</div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                className="item flex items-center p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-150"
                                data-item-id={idx}
                            >
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                                    {idx + 1}
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item}</p>
                                </div>
                                <div className="ml-2">
                                    <button
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                        aria-label="Delete item"
                                        onClick={() => {
                                            const newItems = [...items];
                                            newItems.splice(idx, 1);
                                            setItems(newItems);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Items; 