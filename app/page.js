'use client'; // Ini menandakan komponen ini adalah Client Component

import { useState } from 'react'; // Untuk mengelola state di React

export default function HomePage() {
  // State untuk menyimpan nilai input dari pengguna
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [prompt, setPrompt] = useState('a beautiful landscape'); // Default prompt
  const [seed, setSeed] = useState(''); // Default seed kosong
  const [generatedImageUrl, setGeneratedImageUrl] = useState(''); // Untuk menyimpan URL gambar yang dihasilkan
  const [isLoading, setIsLoading] = useState(false); // Untuk menunjukkan loading

  // Fungsi untuk menangani submit form
  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setIsLoading(true); // Set loading menjadi true

    // Bangun URL API Pollinations.ai berdasarkan input
    // Kita hanya akan mengirim parameter yang diisi (kecuali untuk prompt yang wajib)
    let baseUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

    // Tambahkan parameter opsional jika ada
    if (width) baseUrl += `?width=${width}`;
    if (height) baseUrl += `${width ? '&' : '?'}height=${height}`; // Tambahkan & jika width sudah ada
    // Parameter lain (model, quality, enhance, nologo, private) bisa ditambahkan di sini
    // Untuk contoh ini, kita akan fokus pada width, height, prompt, dan seed.
    baseUrl += `${(width || height) ? '&' : '?'}model=gptimage&quality=hd&enhance=true&nologo=true&private=false`;
    if (seed) baseUrl += `&seed=${seed}`;


    setGeneratedImageUrl(baseUrl); // Set URL gambar yang akan ditampilkan
    setIsLoading(false); // Set loading menjadi false
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Image Generator</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="prompt" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Prompt (Deskripsi Gambar):
          </label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required // Wajib diisi
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label htmlFor="width" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Width:
          </label>
          <input
            type="number"
            id="width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            min="1"
            max="2048"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label htmlFor="height" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Height:
          </label>
          <input
            type="number"
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="1"
            max="2048"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label htmlFor="seed" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Seed (Angka unik untuk hasil yang konsisten):
          </label>
          <input
            type="text"
            id="seed"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading} // Tombol dinonaktifkan saat loading
          style={{
            padding: '12px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>

      {/* Bagian untuk menampilkan gambar */}
      {generatedImageUrl && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h2 style={{ color: '#333' }}>Generated Image:</h2>
          {isLoading ? (
            <p>Loading image...</p>
          ) : (
            <img
              src={generatedImageUrl}
              alt="Generated Image"
              style={{ maxWidth: '100%', height: 'auto', border: '1px solid #eee', borderRadius: '8px' }}
            />
          )}
          <p>
            <a href={generatedImageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'none' }}>
              Open image in new tab
            </a>
          </p>
        </div>
      )}
    </div>
  );
}