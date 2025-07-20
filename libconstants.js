// lib/constants.js

export const AI_MODELS = [
    { label: 'GPT Image (Default)', value: 'gptimage' },
    { label: 'Turbo (Fast)', value: 'turbo' },
    { label: 'Stable Diffusion', value: 'stable-diffusion' },
    { label: 'DALL-E 3 (Experimental)', value: 'dall-e-3' }, // Contoh, pastikan didukung API
];

export const ASPECT_RATIOS = [
    { label: 'Square (1:1)', value: '1:1', width: 1024, height: 1024 },
    { label: 'Portrait (9:16)', value: '9:16', width: 768, height: 1366 },
    { label: 'Landscape (16:9)', value: '16:9', width: 1366, height: 768 },
    { label: 'Custom', value: 'custom', width: 1024, height: 1024 },
];

export const IMAGE_STYLES = [
    { label: 'None', value: '' },
    { label: 'Cinematic Lighting', value: ', cinematic lighting, film grain' },
    { label: 'Fantasy Art', value: ', fantasy art, highly detailed, vivid colors' },
    { label: 'Cyberpunk', value: ', cyberpunk, neon glow, rainy streets' },
    { label: 'Watercolor', value: ', watercolor painting, subtle brushstrokes' },
    { label: 'Abstract', value: ', abstract art, vibrant patterns' },
    { label: 'Hyperrealistic', value: ', hyperrealistic, photographic' },
    { label: 'Anime Style', value: ', anime style, sharp lines, pastel colors' },
    { label: 'Pixel Art', value: ', pixel art, 8-bit, retro game style' },
    { label: 'Cartoon', value: ', cartoon style, vibrant colors' },
];

export const LIGHTING_EFFECTS = [
    { label: 'None', value: '' },
    { label: 'HDR', value: ', HDR, high dynamic range' },
    { label: 'Ultra Detail', value: ', ultra detail, intricate, fine lines' },
    { label: 'Cinematic Lighting', value: ', cinematic lighting, dramatic shadows' },
    { label: 'Neon Glow', value: ', neon glow, vibrant light trails' },
    { label: 'Photorealistic', value: ', photorealistic, natural light' },
    { label: 'Drama Light', value: ', dramatic lighting, chiaroscuro' },
    { label: 'Night Mode', value: ', night mode, low light, subtle illumination' },
];

export const COLOR_PALETTES = [
    { label: 'Default', value: '' },
    { label: 'Vibrant', value: ', vibrant colors' },
    { label: 'Pastel', value: ', pastel colors, soft' },
    { label: 'Monochrome', value: ', monochrome, black and white' },
    { label: 'Warm Tones', value: ', warm tones, golden hour' },
    { label: 'Cool Tones', value: ', cool tones, blue hour' },
    { label: 'RGB', value: ', RGB spectrum, digital glith' },
];

export const COMPOSITIONS = [
    { label: 'Default', value: '' },
    { label: 'Close-up', value: ', close-up shot' },
    { label: 'Wide Shot', value: ', wide shot, expansive view' },
    { label: 'Askew View', value: ', dutch angle, askew view' },
    { label: 'Macro', value: ', macro photography, extreme detail' },
    { label: 'Aerial', value: ', aerial view, drone shot' },
    { label: 'Low View Angle', value: ', low view angle, worm\'s eye view' },
    { label: 'Drone Wide Angle', value: ', drone wide angle view shot' },
];

// URLs untuk berbagi media sosial
export const SHARE_PLATFORMS = {
    facebook: (url, text) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
    whatsapp: (url, text) => `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`,
    twitter: (url, text) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    linkedin: (url, text) => `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
    pinterest: (url, text) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    // TikTok tidak punya API share langsung untuk web, biasanya via salin link atau download
    // Contoh dummy untuk TikTok jika ingin menampilkan ikon saja
    tiktok: (url, text) => `https://www.tiktok.com/tag/AIImageGenerator` // Ini hanya akan mengarah ke hashtag umum
};
