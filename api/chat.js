import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // GEMINI_API_KEY must be stored in Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Gemini API key missing.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        // Build the system prompt using the dashboard's current context
        let systemInstruction = `Eres un asistente de inteligencia artificial experto especializado en el Dashboard de Glaciares & Minería de Argentina (Powered by ColossusLab.tech).
Tu función es responder a las preguntas del usuario sobre los datos analizados.
Se conciso, amable y profesional. Muestra respuestas bien estructuradas (puedes usar Markdown, viñetas, negritas).

CONTEXTO ACTUAL DEL DASHBOARD VERIFICADO POR EL USUARIO:
- Filtros Activos: ${context.filters}
- Estadísticas Actuales: ${context.stats}
- Geoformas Glaciares Visibles: ${context.glaciersCount}
- Proyectos Mineros Visibles: ${context.miningCount}
- Resumen Espacial: ${context.alertSummary}

No debes alucinar. Responde únicamente basándote en la información estadística provista en el contexto y tus conocimientos sobre geografía, minería y glaciología general. Si te preguntan algo que escapa al análisis del dashboard, indicalo cordialmente.`;

        // Make the call to Gemini 2.5 Pro
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2, // Keep responses focused and analytical
            }
        });

        return res.status(200).json({
            text: response.text
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ error: 'Failed to generate response from AI.' });
    }
}
