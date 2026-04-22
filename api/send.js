const nodemailer = require('nodemailer');
const multer = require('multer');

// Konfigurasi multer untuk menyimpan di memori (buffer)
const upload = multer({ storage: multer.memoryStorage() });

// Helper untuk menjalankan middleware di Vercel
const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
};

export const config = {
    api: { bodyParser: false }, // Wajib false agar multer bisa bekerja
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        await runMiddleware(req, res, upload.array('attachments'));

        const { senderEmail, appPassword, receiverEmail, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: appPassword
            }
        });

        const mailOptions = {
            from: senderEmail,
            to: receiverEmail,
            subject: 'Pesan dari Website (Vercel)',
            text: message,
            attachments: req.files.map(file => ({
                filename: file.originalname,
                content: file.buffer // Menggunakan buffer, bukan path file
            }))
        };

        // ... kode atas tetap sama sampai bagian transporter.sendMail ...

        await transporter.sendMail(mailOptions);
        
        // Kirim respon sukses dalam format JSON
        return res.status(200).json({ message: 'Email berhasil dikirim' });

    } catch (error) {
        console.error(error);
        // Kirim respon error dalam format JSON
        return res.status(500).json({ error: 'Gagal mengirim: ' + error.message });
    }
}

