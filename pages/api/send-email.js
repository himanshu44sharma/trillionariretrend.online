// pages/api/send-email.js
import nodemailer from 'nodemailer';
import mailData from "@config/email.json";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { to, subject, text, bcc, cc, name, email } = req.body;
        const body = `
            Hi Team, We have new query with these details :
            
            Name : ${name}
            Email : ${email}
            Text : ${text}
        `

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: mailData.email_user,
                pass: mailData.email_password,
            },
        });

        const mailOptions = {
            from: mailData.email_user,
            to,
            subject: `${mailData.subject} - ${subject}`,
            text: body,
            bcc,
            cc
        };

        console.log({ mailOptions })

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
