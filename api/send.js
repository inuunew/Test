const nodemailer = require('nodemailer');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const runMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });
};

export const config = {
    api: { bodyParser: false },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        await runMiddleware(req, res, upload.array('attachments'));

        const { senderEmail, appPassword, receiverEmail, subject, message } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: appPassword
            }
        });

        // Template HTML Email Profesional
        const htmlTemplate = `
            <div style="font-family: sans-serif; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; max-width: 600px; margin: auto;">
                <div style="background: #2563eb; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Inuu Market</h1>
                    <p style="margin: 0;">Solusi Layanan Digital Terpercaya</p>
                </div>
                <div style="padding: 20px; color: #333;">
                    <p>Halo, terima kasih telah berbelanja!</p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                        <p style="white-space: pre-wrap; margin: 0;">${message}</p>
                    </div>
                    <p style="margin-top: 20px; font-size: 14px;">Jika ada kendala, hubungi admin melalui website kami.</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: `Inuu Market <${senderEmail}>`,
            to: receiverEmail,
            subject: subject,
            html: htmlTemplate,
            attachments: req.files ? req.files.map(file => ({
                filename: file.originalname,
                content: file.buffer
            })) : []
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
