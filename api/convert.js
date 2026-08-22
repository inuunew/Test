export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: false, message: 'URL YouTube wajib diisi' });
  }

  try {
    const apiUrl = `https://api.ikyyxd.my.id/download/ytmp3?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data.status) {
      return res.status(500).json({ status: false, message: 'Gagal memproses URL' });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ status: false, message: 'Terjadi kesalahan pada server' });
  }
}
