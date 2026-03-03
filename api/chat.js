const { GoogleGenAI } = require('@google/genai');

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return res.status(500).json({ error: 'Server configuration error: API key missing.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const systemInstruction = `Eres ColossusAI, un asistente de inteligencia artificial experto especializado en el Dashboard de Glaciares & Minería de Argentina, desarrollado por ColossusLab.tech.
Tu función es analizar y responder preguntas sobre los datos del dashboard.
Sé conciso, amable y profesional. Usa Markdown para estructurar respuestas (viñetas, negritas).
Responde siempre en español argentino.

CONTEXTO ACTUAL DEL DASHBOARD:
- Filtros Activos: ${context?.filters || 'Ninguno'}
- Estadísticas: ${context?.stats || 'No disponible'}
- Glaciares Visibles: ${context?.glaciersCount || 0}
- Proyectos Mineros Visibles: ${context?.miningCount || 0}
- Resumen Espacial: ${context?.alertSummary || 'No disponible'}

Responde únicamente basándote en el contexto provisto y conocimientos generales de geografía, minería y glaciología. Si algo escapa al dashboard, indicalo cordialmente.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro-exp-03-25',
            contents: [{ role: 'user', parts: [{ text: message }] }],
            config: {
                systemInstruction,
                temperature: 0.2,
            }
        });

        const text = response.text;

        return res.status(200).json({ text });

    } catch (error) {
        console.error('Gemini API Error:', error?.message || error);
        return res.status(500).json({
            error: 'Error al conectar con la IA.',
            detail: error?.message
        });
    }
};
