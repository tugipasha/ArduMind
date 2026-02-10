// Vercel üzerinde çalışacak Claude API sunucusuz fonksiyonu
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', ['POST']);
        return response.status(405).end('Method Not Allowed');
    }

    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

    if (!CLAUDE_API_KEY) {
        console.error('Sunucu Hatası: CLAUDE_API_KEY ortam değişkeni bulunamadı.');
        return response.status(500).json({ error: 'Sunucu yapılandırma hatası: API anahtarı eksik.' });
    }

    try {
        const { system, prompt } = request.body;

        if (!prompt) {
            return response.status(400).json({ error: 'İstek gövdesinde "prompt" alanı zorunludur.' });
        }

        const apiRequestBody = {
            model: "claude-3-haiku-20240307", // Hızlı ve uygun maliyetli model
            max_tokens: 1024,
            system: system || "Sen deneyimli bir Arduino eğitmenisin. Öğrencilere nazik, yol gösterici ve teknik açıdan doğru geri bildirimler verirsin. Yanıtlarını kısa ve öz tut.",
            messages: [
                { role: "user", content: prompt }
            ]
        };

        const claudeResponse = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify(apiRequestBody),
        });

        const data = await claudeResponse.json();

        if (!claudeResponse.ok) {
            console.error('Claude API Hatası:', data);
            const errorMessage = data.error ? data.error.message : 'Claude API tarafında bilinmeyen bir hata oluştu.';
            return response.status(claudeResponse.status).json({ error: errorMessage });
        }

        // Başarılı yanıtı istemciye geri gönder
        return response.status(200).json(data);

    } catch (error) {
        console.error('Beklenmedik Sunucu Hatası:', error);
        return response.status(500).json({ error: 'Sunucuda beklenmedik bir hata oluştu: ' + error.message });
    }
}
