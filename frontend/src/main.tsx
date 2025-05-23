import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('app');
if (!container) throw new Error('Root container #app not found');
const root = createRoot(container);
root.render(<App />); 