'use client';

import { useState, useEffect, useCallback } from 'react'; // Tambahkan useEffect dan useCallback
import Head from 'next/head'; // Untuk SEO dan metadata

// Daftar model AI yang tersedia (sesuaikan jika ada model lain dari Pollinations.ai)
const AI_MODELS = [
  { label: 'GPT Image (Default)', value: 'gptimage' },
  { label: 'Turbo (Fast)', value: 'turbo' },
  { label: 'Stable Diffusion', value: 'stable-diffusion' },
  // Tambahkan model lain jika Pollinations.ai mendukungnya
];

// Daftar aspek rasio dengan nilai width/height yang sesuai
const ASPECT_RATIOS = [
  { label: 'Square (1:1)', value: '1:1', width: 1024, height: 1024 },
  { label: 'Portrait (9:16)', value: '9:16', width: 768, height: 1366 }, // Contoh nilai
  { label: 'Landscape (16:9)', value: '16:9', width: 1366, height: 768 }, // Contoh nilai
  { label: 'Custom', value: 'custom', width: 1024, height: 1024 }, // Untuk input manual
];

// Daftar gaya (styles) yang bisa diterapkan pada prompt
const IMAGE_STYLES = [
  { label: 'None', value: '' },
  { label: 'Cinematic', value: ', cinematic lighting' },
  { label: 'Fantasy Art', value: ', fantasy art, highly detailed' },
  { label: 'Cyberpunk', value: ', cyberpunk, neon light, futuristic' },
  { label: 'Watercolor', value: ', watercolor painting' },
  { label: 'Abstract', value: ', abstract art' },
  { label: 'Hyperrealistic', value: ', hyperrealistic' },
  { label: 'Anime Style', value: ', anime style' },
  { label: 'Pixel Art', value: ', pixel art' },
];


export default function HomePage() {
  const [prompt, setPrompt] = useState('a beautiful landscape');
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0].value);
  const [selectedRatio, setSelectedRatio] = useState(ASPECT_RATIOS[0].value);
  const [width, setWidth] = useState(ASPECT_RATIOS[0].width);
  const [height, setHeight] = useState(ASPECT_RATIOS[0].height);
  const [seed, setSeed] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(IMAGE_STYLES[0].value);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]); // State untuk history prompt

  // Efek untuk memuat history prompt dari localStorage saat komponen dimuat
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('deryLauGeneratorHistory');
      if (storedHistory) {
        setPromptHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
    }
  }, []);

  // Efek untuk menyimpan history prompt ke localStorage setiap kali berubah
  useEffect(() => {
    try {
      localStorage.setItem('deryLauGeneratorHistory', JSON.stringify(promptHistory));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [promptHistory]);

  // Handler saat aspek rasio berubah
  const handleRatioChange = (e) => {
    const ratioValue = e.target.value;
    setSelectedRatio(ratioValue);
    const selected = ASPECT_RATIOS.find(r => r.value === ratioValue);
    if (selected && selected.value !== 'custom') {
      setWidth(selected.width);
      setHeight(selected.height);
    }
  };

  // Fungsi untuk menambahkan prompt ke history
  const addPromptToHistory = useCallback((newPrompt) => {
    setPromptHistory(prevHistory => {
      // Pastikan tidak ada duplikat dan batasi jumlah history
      const updatedHistory = [newPrompt, ...prevHistory.filter(item => item !== newPrompt)].slice(0, 10); // Batasi 10 item
      return updatedHistory;
    });
  }, []);

  // Fungsi untuk menghapus seluruh history
  const clearHistory = () => {
    setPromptHistory([]);
    // localStorage.removeItem('deryLauGeneratorHistory'); // Opsional: Hapus juga dari localStorage secara langsung
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedImageUrl(''); // Kosongkan gambar sebelumnya

    let currentPrompt = prompt.trim();
    if (selectedStyle) {
      currentPrompt += selectedStyle; // Tambahkan gaya ke prompt
    }

    // Bangun URL API Pollinations.ai berdasarkan input
    let baseUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(currentPrompt)}`;

    // Tambahkan parameter
    baseUrl += `?width=${width}`;
    baseUrl += `&height=${height}`;
    baseUrl += `&model=${selectedModel}`;
    baseUrl += `&quality=hd&enhance=true&nologo=true&private=false`; // Parameter default

    if (seed) {
      baseUrl += `&seed=${seed}`;
    }

    // Simpan prompt ke history setelah berhasil generate
    addPromptToHistory(currentPrompt);

    setGeneratedImageUrl(baseUrl);
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>DERY LAU GENERATOR AI</title>
        <meta name="description" content="Generate amazing images with DERY LAU GENERATOR AI using Next.js and Pollinations.ai" />
      </Head>

      <div className="container">
        <h1 className="main-title">DERY LAU GENERATOR AI</h1>

        <div className="generator-card">
          <form onSubmit={handleSubmit} className="generator-form">
            <div className="form-group">
              <label htmlFor="prompt">Prompt (Deskripsi Gambar):</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                rows="3"
                placeholder="Ex: A futuristic city at sunset, highly detailed, cyberpunk style"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="model">Model AI:</label>
                <select
                  id="model"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {AI_MODELS.map(model => (
                    <option key={model.value} value={model.value}>{model.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="aspectRatio">Aspek Rasio:</label>
                <select
                  id="aspectRatio"
                  value={selectedRatio}
                  onChange={handleRatioChange}
                >
                  {ASPECT_RATIOS.map(ratio => (
                    <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedRatio === 'custom' && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="width">Width:</label>
                  <input
                    type="number"
                    id="width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    min="1"
                    max="2048"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="height">Height:</label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="1"
                    max="2048"
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="seed">Seed (Optional):</label>
                <input
                  type="text"
                  id="seed"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="Leave empty for random"
                />
              </div>

              <div className="form-group">
                <label htmlFor="style">Style:</label>
                <select
                  id="style"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                >
                  {IMAGE_STYLES.map(style => (
                    <option key={style.value} value={style.value}>{style.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="generate-button">
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>
        </div>

        {/* Prompt History Section */}
        {promptHistory.length > 0 && (
          <div className="history-card">
            <h2>History Prompts</h2>
            <div className="history-list">
              {promptHistory.map((histPrompt, index) => (
                <span
                  key={index}
                  className="history-item"
                  onClick={() => setPrompt(histPrompt)}
                  title="Click to use this prompt"
                >
                  {histPrompt.length > 50 ? histPrompt.substring(0, 50) + '...' : histPrompt}
                </span>
              ))}
            </div>
            <button onClick={clearHistory} className="clear-history-button">
              Clear History
            </button>
          </div>
        )}

        {/* Generated Image Section */}
        {generatedImageUrl && (
          <div className="image-display-card">
            <h2>Generated Image</h2>
            {isLoading ? (
              <p className="loading-text">Loading image...</p>
            ) : (
              <img
                src={generatedImageUrl}
                alt="Generated Image"
                className="generated-image"
              />
            )}
            <p className="image-link">
              <a href={generatedImageUrl} target="_blank" rel="noopener noreferrer">
                Open image in new tab
              </a>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
