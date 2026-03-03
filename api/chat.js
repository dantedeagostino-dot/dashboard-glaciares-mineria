// api/chat.js - Vercel Serverless Function
// Uses native fetch to call Gemini REST API directly (no SDK dependency issues)

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key not configured.' });

    const systemText = `Eres ColossusAI, un asistente de inteligencia artificial experto desarrollado por ColossusLab.tech, especializado en el Dashboard de Glaciares & Minería de Argentina.
Responde siempre en español argentino. Sé conciso y usa Markdown para estructurar respuestas.

CONTEXTO ACTUAL DEL DASHBOARD:
- Filtros Activos: ${context?.filters || 'Ninguno'}
- Estadísticas: ${context?.stats || 'No disponible'}
- Glaciares Visibles: ${context?.glaciersCount ?? 0}
- Proyectos Mineros Visibles: ${context?.miningCount ?? 0}
- Resumen Espacial: ${context?.alertSummary || 'No disponible'}

Responde basándote en el contexto y conocimientos de geografía, minería y glaciología. Si algo escapa al dashboard, indicalo cordialmente.`;

    const GEMINI_MODEL = 'gemini-2.0-flash-001';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const body = {
        system_instruction: {
            parts: [{ text: systemText }]
        },
        contents: [
            { role: 'user', parts: [{ text: message }] }
        ],
        generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API error:', JSON.stringify(data));
            return res.status(500).json({ error: `Gemini API error: ${data?.error?.message || 'Unknown'}` });
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            console.error('Unexpected Gemini response:', JSON.stringify(data));
            return res.status(500).json({ error: 'No response from AI.' });
        }

        return res.status(200).json({ text });

    } catch (err) {
        console.error('Network error calling Gemini:', err.message);
        return res.status(500).json({ error: 'Network error connecting to AI.' });
    }
};
