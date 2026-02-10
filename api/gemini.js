// Bu dosya, Gemini API'sine güvenli bir şekilde istek atmak için kullanılacak
// sunucusuz fonksiyonu içerecektir.

exports.handler = async function(event, context) {
    // API anahtarını ortam değişkenlerinden (environment variable) güvenli bir şekilde al
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // İstemciden gelen isteğin gövdesini al
    const requestBody = JSON.parse(event.body);

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            // Gemini API'sinden gelen hatayı yakala ve istemciye gönder
            const errorData = await response.json();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorData.error.message }),
            };
        }

        const data = await response.json();

        // Başarılı yanıtı istemciye geri gönder
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        // Genel bir sunucu hatası durumunda
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error: ' + error.message }),
        };
    }
};
