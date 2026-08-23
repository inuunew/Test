const fetch = require('node-fetch');

function cleanJson(obj) {
    if (Array.isArray(obj)) {
        return obj.map(cleanJson).filter(v => v !== null && v !== undefined);
    }
    if (obj !== null && typeof obj === 'object') {
        const cleaned = {};
        for (const [k, v] of Object.entries(obj)) {
            if (v === null || v === undefined || v === '') continue;
            if (Array.isArray(v) && v.length === 0) continue;
            cleaned[k] = cleanJson(v);
        }
        return cleaned;
    }
    return obj;
}

class VeloflixEngine {
    constructor() {
        this.baseUrl = 'https://veloflix.my.id';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://veloflix.my.id/'
        };
    }

    async _get(endpoint, isJson = true) {
        const fullUrl = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
        try {
            const resp = await fetch(fullUrl, { headers: this.headers });
            if (resp.ok) return isJson ? await resp.json() : await resp.text();
        } catch (err) {
            return null;
        }
        return null;
    }

    _parseCardsFromHtml(htmlChunk) {
        const cardRegex = /<a[^>]*href="\/(title|watch)\/(movie|tv)\/(\d+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
        const cards = [];
        const seenIds = new Set();
        let cm;
        while ((cm = cardRegex.exec(htmlChunk)) !== null) {
            const type = cm[2];
            const id = parseInt(cm[3], 10);
            const inner = cm[4];
            if (seenIds.has(id)) continue;
            seenIds.add(id);

            const titleM = inner.match(/title="([^"]+)"/) || inner.match(/<p[^>]*class="[^"]*truncate[^"]*"[^>]*>([^<]+)<\/p>/);
            const title = titleM ? titleM[1].replace(/&amp;/g, '&').trim() : '';
            const imgM = inner.match(/srcSet="([^"]+)"/) || inner.match(/src="([^"]+)"/);
            let poster = null;
            if (imgM) {
                const decoded = decodeURIComponent(imgM[1]);
                const tmdbMatch = decoded.match(/https:\/\/image\.tmdb\.org\/t\/p\/[^\s&]+/);
                poster = tmdbMatch ? tmdbMatch[0] : null;
            }
            const ratingM = inner.match(/([0-9]+\.?[0-9]*)\s*<span class="sr-only">/);
            const rating = ratingM ? parseFloat(ratingM[1]) : null;
            const yearM = inner.match(/(\d{4})\s*<\/span>/);
            const year = yearM ? parseInt(yearM[1], 10) : null;

            if (id && title) {
                cards.push({ id, mediaType: type, title, year, rating: rating ? `${rating} / 10` : undefined, posterUrl: poster });
            }
        }
        return cards;
    }

    async getHomepageFullFeed() {
        const html = await this._get('/', false);
        if (!html) return { total_kategori: 0, kategori: [] };
        const sections = html.match(/<section[^>]*>[\s\S]*?<\/section>/g) || [];
        const categories = [];
        const allUniqueTitles = new Map();

        for (let sec of sections) {
            const titleMatch = sec.match(/<h2[^>]*>(.*?)<\/h2>/);
            const categoryName = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : null;
            if (!categoryName || categoryName.includes('Support')) continue;
            const cards = this._parseCardsFromHtml(sec);
            if (cards.length > 0) {
                cards.forEach(c => allUniqueTitles.set(c.id, c));
                categories.push({ nama_kategori: categoryName, daftar_film: cards });
            }
        }
        return { total_kategori: categories.length, total_judul_unik: allUniqueTitles.size, kategori_beranda: categories };
    }

    async search(query) {
        const html = await this._get(`/search?q=${encodeURIComponent(query)}`, false);
        if (!html) return [];
        return this._parseCardsFromHtml(html);
    }

    async getDetail(type, tmdbId) {
        const res = await this._get(`/api/title/${type}/${tmdbId}`);
        const d = res?.data || {};
        if (!d.title) return {};
        return {
            id_tmdb: d.id,
            judul: d.title,
            jenis: d.mediaType === 'tv' ? 'TV Series' : 'Film (Movie)',
            tahun: d.year,
            rating: d.rating ? `${d.rating.toFixed(1)} / 10` : undefined,
            genre: d.genres || [],
            imdb_id: d.imdbId,
            poster_url: d.posterUrl,
            sinopsis: d.overview || 'Sinopsis belum tersedia.'
        };
    }

    async getStreamingServers(type, tmdbId, season = 1, episode = 1) {
        const isMovie = type === 'movie';
        return isMovie ? {
            "Server 1 (Vidlink Fast 1080p)": `https://vidlink.pro/movie/${tmdbId}?primaryColor=e50914&autoplay=true`,
            "Server 2 (NxSha AWS Multi-Audio)": `https://web.nxsha.app/embed/movie/${tmdbId}?server=AwsPly-[Multi-Lang]`,
            "Server 3 (ZxcStream Dub Indo)": `https://zxcstream.xyz/player/movie/${tmdbId}?dubLang=id`,
            "Server 4 (Videasy 4K Ultra HD)": `https://player.videasy.net/movie/${tmdbId}`,
            "Server 5 (Cinesrc High-Speed)": `https://cinesrc.st/embed/movie/${tmdbId}`,
            "Server 6 (AutoEmbed Multi)": `https://player.autoembed.co/embed/movie/${tmdbId}`,
            "Server 7 (2Embed Cloud)": `https://2embed.cc/embed/${tmdbId}`,
            "Server 8 (VidSrc SBS Pro)": `https://vidsrc.sbs/embed/movie/${tmdbId}?color=e50914&sub=id`
        } : {
            "Server 1 (Vidlink Fast 1080p)": `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}?primaryColor=e50914&autoplay=true`,
            "Server 2 (NxSha AWS Multi-Audio)": `https://web.nxsha.app/embed/tv/${tmdbId}/${season}/${episode}?server=AwsPly-[Multi-Lang]`,
            "Server 3 (ZxcStream Dub Indo)": `https://zxcstream.xyz/player/tv/${tmdbId}/${season}/${episode}/en?dubLang=id`,
            "Server 4 (Videasy 4K Ultra HD)": `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`,
            "Server 5 (Cinesrc High-Speed)": `https://cinesrc.st/embed/tv/${tmdbId}?s=${season}&e=${episode}`,
            "Server 6 (AutoEmbed Multi)": `https://player.autoembed.co/embed/tv/${tmdbId}/${season}/${episode}`,
            "Server 7 (2Embed Cloud)": `https://2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`,
            "Server 8 (VidSrc SBS Pro)": `https://vidsrc.sbs/embed/tv/${tmdbId}/${season}/${episode}?color=e50914&sub=id`
        };
    }
}

module.exports = { VeloflixEngine, cleanJson };
