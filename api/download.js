export default async function handler(req, res) {
  const { url, title } = req.query;

  if (!url) {
    return res.status(400).send('URL stream tidak ditemukan');
  }

  try {
    const audioRes = await fetch(url);

    if (!audioRes.ok) {
      throw new Error('Gagal mengambil audio dari CDN YouTube');
    }

    // Sanitasi nama file agar aman digunakan
    const safeTitle = (title || 'audio')
      .replace(/[^a-zA-Z0-9\s\-_]/g, '')
      .trim() || 'audio';

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(safeTitle)}.mp3"`);

    const arrayBuffer = await audioRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.send(buffer);
  } catch (error) {
    res.status(500).send('Gagal mengunduh audio: ' + error.message);
  }
}
