const { VeloflixEngine, cleanJson } = require('../lib/engine');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Parameter "q" (query) wajib diisi' });

    try {
        const engine = new VeloflixEngine();
        const results = await engine.search(q);
        res.status(200).json(cleanJson({ status: 200, keyword: q, results }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
