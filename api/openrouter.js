// Vercel üzerinde çalışacak OpenRouter API sunucusuz fonksiyonu
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', ['POST']);
        return response.status(405).end('Method Not Allowed');
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

    if (!OPENROUTER_API_KEY) {
        console.error('Sunucu Hatası: OPENROUTER_API_KEY ortam değişkeni bulunamadı.');
        return response.status(500).json({ error: 'Sunucu yapılandırma hatası: API anahtarı eksik.' });
    }

    try {
        const { prompt } = request.body;

        if (!prompt) {
            return response.status(400).json({ error: 'İstek gövdesinde "prompt" alanı zorunludur.' });
        }

        const apiRequestBody = {
            model: "@preset/ardu-mind-ai",
            temperature: 0.4,
            top_p: 0.9,
            max_tokens: 350,
            frequency_penalty: 0.2,
            messages: [
                { role: "user", content: prompt }
            ]
        };

        const openRouterResponse = await fetch(OPENROUTER_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://ardumind.vercel.app',
                'X-Title': 'ArduMind'
            },
            body: JSON.stringify(apiRequestBody),
        });

        const data = await openRouterResponse.json();

        if (!openRouterResponse.ok) {
            console.error('OpenRouter API Hatası:', data);
            const errorMessage = data.error ? data.error.message : 'OpenRouter API tarafında bilinmeyen bir hata oluştu.';
            return response.status(openRouterResponse.status).json({ error: errorMessage });
        }

        return response.status(200).json(data);

    } catch (error) {
        console.error('Beklenmedik Sunucu Hatası:', error);
        return response.status(500).json({ error: 'Sunucuda beklenmedik bir hata oluştu: ' + error.message });
    }
}
