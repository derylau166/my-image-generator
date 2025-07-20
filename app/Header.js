// components/Header.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // Menggunakan next/image untuk gambar
import { getDictionary } from '../lib/dictionary'; // Kita akan buat file ini nanti

export default function Header({ lang, setLang }) {
    const [darkMode, setDarkMode] = useState(false);
    const [t, setT] = useState({}); // State untuk terjemahan

    useEffect(() => {
        // Ambil terjemahan saat komponen dimuat atau bahasa berubah
        const loadDictionary = async () => {
            const dictionary = await getDictionary(lang);
            setT(dictionary);
        };
        loadDictionary();

        // Load dark mode preference dari localStorage
        if (typeof window !== 'undefined') {
            const storedDarkMode = localStorage.getItem('darkMode');
            if (storedDarkMode !== null) {
                setDarkMode(JSON.parse(storedDarkMode));
                document.documentElement.classList.toggle('dark-mode', JSON.parse(storedDarkMode));
            }
        }
    }, [lang]); // Reload terjemahan dan mode jika lang berubah

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        document.documentElement.classList.toggle('dark-mode', newDarkMode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
        }
    };

    const handleLangChange = (e) => {
        setLang(e.target.value);
    };

    return (
        <header className="header">
            <div className="header-container">
                <h1 className="header-title">{t.appTitle || "DERY LAU AI GENERATOR"}</h1>
                <div className="header-controls">
                    <select value={lang} onChange={handleLangChange} className="lang-select">
                        <option value="en">English</option>
                        <option value="id">Indonesia</option>
                    </select>
                    <button onClick={toggleDarkMode} className="dark-mode-toggle">
                        {darkMode ? (
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}

// Fungsi helper untuk memuat terjemahan
// lib/dictionary.js (buat file ini)
// import 'server-only' // Jika ingin memastikan hanya berjalan di server (Next.js App Router)
const dictionaries = {
    en: () => import('../locales/en.json').then((module) => module.default),
    id: () => import('../locales/id.json').then((module) => module.default),
};

export const getDictionary = async (locale) => dictionaries[locale]();

