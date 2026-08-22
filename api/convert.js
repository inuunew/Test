export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: false, message: 'URL YouTube wajib diisi' });
  }

  try {
    // Menggunakan API Cobalt (Open Source YouTube Downloader)
    const response = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        downloadMode: 'audio',
        audioFormat: 'mp3'
      })
    });

    const data = await response.json();

    if (data.status === 'error') {
      return res.status(400).json({ status: false, message: data.text || 'Gagal memproses URL' });
    }

    // Cobalt mengembalikan URL download/tunnel langsung yang bebas HTTP 403
    res.status(200).json({
      status: true,
      downloadUrl: data.url
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Terjadi kesalahan pada server' });
  }
}
