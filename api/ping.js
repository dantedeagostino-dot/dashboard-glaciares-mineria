// api/ping.js — Endpoint de diagnóstico temporal
module.exports = function handler(req, res) {
    res.status(200).json({
        ok: true,
        node: process.version,
        hasFetch: typeof fetch !== 'undefined',
        hasKey: !!process.env.GEMINI_API_KEY,
        keyPreview: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 8) + '...' : 'MISSING'
    });
};
