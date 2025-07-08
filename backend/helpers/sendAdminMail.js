import nodemailer from "nodemailer";

const sendAdminMail = async (subject, html) => {
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
        from: `"RHR Website" <${process.env.EMAIL_USER}>`,
        to: `${process.env.VITE_ADMIN_EMAIL}`,
        subject,
        html,
    });
};

export default sendAdminMail;