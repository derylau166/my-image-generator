// components/Footer.js
'use client'; // Client component karena menggunakan t

import { useState, useEffect } from 'react';
import { getDictionary } from '../lib/dictionary';

export default function Footer({ lang }) {
    const [t, setT] = useState({});

    useEffect(() => {
        const loadDictionary = async () => {
            const dictionary = await getDictionary(lang);
            setT(dictionary);
        };
        loadDictionary();
    }, [lang]);

    return (
        <footer className="footer">
            <div className="footer-container">
                <p>{t.copyright || "Copyright ©2025 DERY LAU GENERATOR AI"}</p>
                <p>{t.poweredBy || "Powered by. Pollinations API,"}</p>
                <p>{t.developedBy || "Developed by. Dery Lau,"}</p>
                <p>{t.thanksTo || "Thanks to Github & Vercel"}</p>
            </div>
        </footer>
    );
}
