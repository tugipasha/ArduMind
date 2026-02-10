// Vercel'in standart formatına uygun sunucusuz fonksiyon
export default async function handler(request, response) {
    // Sadece POST isteklerine izin ver
    if (request.method !== 'POST') {
        response.setHeader('Allow', ['POST']);
        return response.status(405).end('Method Not Allowed');
    }

    // API anahtarını ortam değişkenlerinden güvenli bir şekilde al
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // Eğer API anahtarı Vercel'de tanımlanmamışsa, özel bir hata döndür
    if (!GEMINI_API_KEY) {
        console.error('Sunucu Hatası: GEMINI_API_KEY ortam değişkeni bulunamadı.');
        return response.status(500).json({ error: 'Sunucu yapılandırma hatası: API anahtarı eksik.' });
    }

    try {
        // İstemciden gelen isteğin gövdesini al
        const requestBody = request.body;

        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await geminiResponse.json();

        // Gemini API'sinden gelen hatayı yakala ve istemciye gönder
        if (!geminiResponse.ok) {
            console.error('Gemini API Hatası:', data);
            return response.status(geminiResponse.status).json({ error: data.error.message || 'Gemini API tarafında bir hata oluştu.' });
        }

        // Başarılı yanıtı istemciye geri gönder
        return response.status(200).json(data);

    } catch (error) {
        console.error('Beklenmedik Sunucu Hatası:', error);
        return response.status(500).json({ error: 'Sunucuda beklenmedik bir hata oluştu: ' + error.message });
    }
}
