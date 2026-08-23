const { VeloflixEngine, cleanJson } = require('../lib/engine');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { id, type = 'movie', season = 1, episode = 1 } = req.query;
    if (!id) return res.status(400).json({ error: 'Parameter id wajib diisi' });

    try {
        const engine = new VeloflixEngine();
        const detail = await engine.getDetail(type, id);
        const servers = await engine.getStreamingServers(type, id, season, episode);
        res.status(200).json(cleanJson({ status: 200, creator: 'Lann', detail, server_streaming: servers }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
