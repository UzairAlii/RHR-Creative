// helpers/sendUserMail.js
import nodemailer from "nodemailer";

const sendUserMail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"RHR Creative" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

export default sendUserMail;
