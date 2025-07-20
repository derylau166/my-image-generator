'use client';

import { useState, useEffect, useCallback } from 'react';
import { getDictionary } from '../lib/dictionary';
import useLocalStorage from '../hooks/useLocalStorage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from 'next/image'; // Menggunakan next/image

import {
    AI_MODELS,
    ASPECT_RATIOS,
    IMAGE_STYLES,
    LIGHTING_EFFECTS,
    COLOR_PALETTES,
    COMPOSITIONS,
    SHARE_PLATFORMS
} from '../lib/constants'; // Impor semua konstanta

export default function HomePage() {
    const [lang, setLang] = useLocalStorage('lang', 'en'); // State untuk bahasa
    const [t, setT] = useState({}); // State untuk terjemahan

    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState(''); // Fitur Negative Prompt
    const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].value);
    const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0].value);
    const [width, setWidth] = useState(ASPECT_RATIOS[0].width);
    const [height, setHeight] = useState(ASPECT_RATIOS[0].height);
    const [seed, setSeed] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(IMAGE_STYLES[0].value);
    const [selectedLighting, setSelectedLighting] = useState(LIGHTING_EFFECTS[0].value); // Fitur Peningkatan Cahaya
    const [selectedColorPalette, setSelectedColorPalette] = useState(COLOR_PALETTES[0].value); // Fitur Color Palette
    const [selectedComposition, setSelectedComposition] = useState(COMPOSITIONS[0].value); // Fitur Composition

    const [generatedImages, setGeneratedImages] = useLocalStorage('deryLauGeneratorImages', []); // Array untuk menyimpan hasil gambar
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null); // State untuk error API
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false); // Untuk toggle advanced settings

    // Load dictionary based on lang state
    useEffect(() => {
        const loadDictionary = async () => {
            const dictionary = await getDictionary(lang);
            setT(dictionary);
        };
        loadDictionary();
    }, [lang]);

    // Update width/height when aspect ratio changes
    const handleRatioChange = (e) => {
        const ratioValue = e.target.value;
        setSelectedRatio(ratioValue);
        const selected = ASPECT_RATIOS.find(r => r.value === ratioValue);
        if (selected && selected.value !== 'custom') {
            setWidth(selected.width);
            setHeight(selected.height);
        }
    };

    // Add prompt to history and limit size
    const addImageToHistory = useCallback((newImage) => {
        setGeneratedImages(prevHistory => {
            // Add new image at the beginning, limit to 10
            const updatedHistory = [newImage, ...prevHistory.slice(0, 10)];
            return updatedHistory;
        });
    }, [setGeneratedImages]); // Dependency on setGeneratedImages

    // Clear all history
    const clearHistory = () => {
        if (confirm(t.clearHistoryConfirmation || "Are you sure you want to clear all history?")) {
            setGeneratedImages([]);
        }
    };

    // Generate Image Function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setApiError(null); // Reset error

        let currentPrompt = prompt.trim();
        // Gabungkan semua parameter tambahan ke prompt utama
        currentPrompt += selectedStyle ? selectedStyle : '';
        currentPrompt += selectedLighting ? selectedLighting : '';
        currentPrompt += selectedColorPalette ? selectedColorPalette : '';
        currentPrompt += selectedComposition ? selectedComposition : '';

        // Build Pollinations.ai API URL
        let baseUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(currentPrompt)}`;

        // Add mandatory parameters
        baseUrl += `?width=${width}`;
        baseUrl += `&height=${height}`;
        baseUrl += `&model=${selectedModel}`;
        baseUrl += `&quality=hd&enhance=true&nologo=true&private=false`;

        // Add optional parameters
        if (seed) baseUrl += `&seed=${seed}`;
        if (negativePrompt) baseUrl += `&negative_prompt=${encodeURIComponent(negativePrompt)}`; // Tambah negative prompt

        // Simulate API call to check for errors (Pollinations.ai doesn't directly return errors for invalid prompts)
        // For actual error handling, you'd check image validity after loading or rely on API response codes if available.
        // For Pollinations.ai, often it just returns a "broken" image if prompt is bad.
        // We'll simulate a more robust check here or show basic loading.

        try {
            // Ini sebenarnya tidak memanggil API untuk mendapatkan JSON response,
            // tapi akan mencoba memuat gambar untuk menangani error jika URL tidak valid
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Add to history if successful
            addImageToHistory({
                prompt: prompt, // Simpan prompt asli tanpa tambahan style dll
                negativePrompt: negativePrompt,
                imageUrl: baseUrl,
                timestamp: new Date().toISOString(),
                fullPrompt: currentPrompt // Simpan prompt lengkap yang dikirim ke API
            });

        } catch (error) {
            console.error("Error generating image:", error);
            setApiError(`${t.apiError} ${error.message}`);
            setGeneratedImages([]); // Clear images if there's an error
        } finally {
            setIsLoading(false);
        }
    };

    // Share Image Function
    const handleShare = (platform, imageUrl, promptText) => {
        const textToShare = `${t.appTitle}: "${promptText}" - Check out my AI image!`;
        if (SHARE_PLATFORMS[platform]) {
            window.open(SHARE_PLATFORMS[platform](imageUrl, textToShare), '_blank');
        } else if (platform === 'copy') {
            navigator.clipboard.writeText(imageUrl).then(() => {
                alert(t.copiedLink);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }
    };

    // Download Image Function
    const handleDownload = async (imageUrl, promptText) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${promptText.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50)}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Error downloading image. Please try again.');
            console.error('Download error:', error);
        }
    };

    return (
        <div className="app-container">
            <Header lang={lang} setLang={setLang} />

            <main className="main-content container">
                <div className="generator-grid">
                    <div className="generator-form-card card">
                        <h2>{t.appTitle || "DERY LAU AI GENERATOR"}</h2>
                        <form onSubmit={handleSubmit} className="generator-form">
                            <div className="form-group">
                                <label htmlFor="prompt">{t.promptLabel || "Prompt (Image Description):"}</label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    required
                                    rows="3"
                                    placeholder={t.promptPlaceholder || "Ex: A futuristic city at sunset..."}
                                ></textarea>
                                <button type="button" className="copy-prompt-button" onClick={() => { navigator.clipboard.writeText(prompt); alert(t.copiedPrompt || "Prompt copied!"); }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                </button>
                            </div>

                            <div className="form-group">
                                <label htmlFor="negativePrompt">{t.negativePromptLabel || "Negative Prompt (Things to avoid):"}</label>
                                <input
                                    type="text"
                                    id="negativePrompt"
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                    placeholder={t.negativePromptPlaceholder || "Ex: blurry, low resolution, watermark"}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="model">{t.modelLabel || "AI Model:"}</label>
                                    <select
                                        id="model"
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                    >
                                        {AI_MODELS.map(model => (
                                            <option key={model.value} value={model.value}>{t[model.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] || model.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="aspectRatio">{t.aspectRatioLabel || "Aspect Ratio:"}</label>
                                    <select
                                        id="aspectRatio"
                                        value={selectedRatio}
                                        onChange={handleRatioChange}
                                    >
                                        {ASPECT_RATIOS.map(ratio => (
                                            <option key={ratio.value} value={ratio.value}>{t[ratio.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] || ratio.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {selectedRatio === 'custom' && (
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="width">{t.widthLabel || "Width:"}</label>
                                        <input
                                            type="number"
                                            id="width"
                                            value={width}
                                            onChange={(e) => setWidth(parseInt(e.target.value))}
                                            min="1"
                                            max="2048"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="height">{t.heightLabel || "Height:"}</label>
                                        <input
                                            type="number"
                                            id="height"
                                            value={height}
                                            onChange={(e) => setHeight(parseInt(e.target.value))}
                                            min="1"
                                            max="2048"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="seed">{t.seedLabel || "Seed (Optional):"}</label>
                                    <input
                                        type="text"
                                        id="seed"
                                        value={seed}
                                        onChange={(e) => setSeed(e.target.value)}
                                        placeholder={t.seedPlaceholder || "Leave empty for random"}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="style">{t.styleLabel || "Style:"}</label>
                                    <select
                                        id="style"
                                        value={selectedStyle}
                                        onChange={(e) => setSelectedStyle(e.target.value)}
                                    >
                                        {IMAGE_STYLES.map(style => (
                                            <option key={style.value} value={style.value}>{t[style.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] || style.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lighting">{t.lightingLabel || "Lighting/Effect:"}</label>
                                <select
                                    id="lighting"
                                    value={selectedLighting}
                                    onChange={(e) => setSelectedLighting(e.target.value)}
                                >
                                    {LIGHTING_EFFECTS.map(effect => (
                                        <option key={effect.value} value={effect.value}>{t[effect.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] || effect.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Advanced Settings Toggle */}
                            <button
                                type="button"
                                className="advanced-settings-toggle"
                                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                            >
                                {t.advancedSettingsTitle || "Advanced Settings"} {showAdvancedSettings ? '▲' : '▼'}
                            </button>

                            {/* Advanced Settings */}
                            {showAdvancedSettings && (
                                <div className="advanced-settings-panel">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="colorPalette">{t.colorPaletteLabel || "Color Palette:"}</label>
                                            <select
                                                id="colorPalette"
                                                value={selectedColorPalette}
                                                onChange={(e) => setSelectedColorPalette(e.target.value)}
                                            >
                                                {COLOR_PALETTES.map(palette => (
                                                    <option key={palette.value} value={palette.value}>{t[palette.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] || palette.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="composition">{t.compositionLabel || "Composition:"}</label>
                                            <select
                                                id="composition"
                                                value={selectedComposition}
                                                onChange={(e) => setSelectedComposition(e.target.value)}
                                            >
                                                {COMPOSITIONS.map(comp => (
                                                    <option key={comp.value} value={comp.value}>{t[comp.label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()] || comp.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button type="submit" disabled={isLoading} className="generate-button">
                                {isLoading ? t.generatingButton : t.generateButton || "Generate Image"}
                            </button>

                            {apiError && <p className="error-message">{apiError}</p>}

                            {isLoading && (
                                <div className="loading-animation">
                                    <p>{t.loadingText || "DERY AI LOADING..."}</p>
                                    <div className="spinner"></div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Image History & Display Grid */}
                    <div className="image-output-section">
                        {generatedImages.length > 0 && (
                            <div className="history-card card">
                                <h2>{t.historyTitle || "History Prompts"}</h2>
                                <div className="history-grid">
                                    {generatedImages.map((imgData, index) => (
                                        <div key={index} className="history-item-container">
                                            <Image
                                                src={imgData.imageUrl}
                                                alt={imgData.prompt || 'Generated Image'}
                                                width={200} // Ukuran thumbnail
                                                height={200} // Ukuran thumbnail
                                                className="history-thumbnail"
                                                onClick={() => { // Klik thumbnail untuk menampilkan lebih besar atau pakai promptnya
                                                    setPrompt(imgData.prompt);
                                                    setNegativePrompt(imgData.negativePrompt);
                                                    setSeed(imgData.seed || '');
                                                    setGeneratedImages([imgData, ...generatedImages.filter((_, i) => i !== index)]); // Bawa ke paling atas
                                                }}
                                                title={t.clickToUsePrompt || "Click to use this prompt"}
                                            />
                                            <p className="history-prompt-text">{imgData.prompt.length > 30 ? imgData.prompt.substring(0, 30) + '...' : imgData.prompt}</p>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={clearHistory} className="clear-history-button">
                                    {t.clearHistory || "Clear History"}
                                </button>
                            </div>
                        )}

                        {generatedImages.length > 0 && (
                             <div className="image-display-card card">
                                <h2>{t.generatedImageTitle || "Generated Image"}</h2>
                                <div className="generated-image-wrapper">
                                    {isLoading ? (
                                        <p className="loading-text">{t.loadingText || "DERY AI LOADING..."}</p>
                                    ) : (
                                        <Image
                                            src={generatedImages[0].imageUrl} // Tampilkan gambar terbaru
                                            alt={generatedImages[0].prompt || 'Generated Image'}
                                            width={generatedImages[0].width || 512} // Ambil width dari history
                                            height={generatedImages[0].height || 512} // Ambil height dari history
                                            className="main-generated-image"
                                            unoptimized // Pollinations API tidak mendukung optimasi image Next.js secara default
                                        />
                                    )}
                                </div>

                                <p className="image-link">
                                    <a href={generatedImages[0].imageUrl} target="_blank" rel="noopener noreferrer">
                                        {t.openImageInNewTab || "Open image in new tab"}
                                    </a>
                                </p>
                                <div className="image-actions">
                                    <button onClick={() => handleDownload(generatedImages[0].imageUrl, generatedImages[0].prompt)} className="action-button download-button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        {t.downloadImage || "Download"}
                                    </button>
                                    <div className="share-buttons">
                                        <button onClick={() => handleShare('facebook', generatedImages[0].imageUrl, generatedImages[0].prompt)} className="action-button share-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                            Share
                                        </button>
                                        <button onClick={() => handleShare('whatsapp', generatedImages[0].imageUrl, generatedImages[0].prompt)} className="action-button share-button">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                            Share
                                        </button>
                                        {/* Tambahkan tombol share lainnya */}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer lang={lang} />
        </div>
    );
}
