export default async function handler(req, res) {
    // 1. Mengatur CORS Headers agar API ini bisa diakses dari webmu
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Ambil parameter URL yang dikirim oleh frontend
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ 
            status: false, 
            message: 'Harap sertakan parameter URL' 
        });
    }

    try {
        // 3. Lakukan proses fetch ke website target dari sisi server
        const response = await fetch(url, {
            headers: {
                // Menyamar sebagai browser biasa agar tidak ditolak oleh website target
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Website menolak akses. Status: ${response.status}`);
        }

        // 4. Ambil teks HTML-nya
        const html = await response.text();

        // 5. Kembalikan data dalam format JSON persis seperti API lamamu
        return res.status(200).json({
            status: true,
            result: { html: html }
        });

    } catch (error) {
        return res.status(500).json({ 
            status: false, 
            message: error.message 
        });
    }
}
