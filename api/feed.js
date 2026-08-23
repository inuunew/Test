const { VeloflixEngine, cleanJson } = require('../lib/engine');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const engine = new VeloflixEngine();
        const feed = await engine.getHomepageFullFeed();
        res.status(200).json(cleanJson({ status: 200, ...feed }));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
