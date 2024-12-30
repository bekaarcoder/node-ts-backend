import nodemailer, { SendMailOptions } from 'nodemailer';

class Email {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 587,
            secure: false,
            auth: {
                user: '1d614e402cdb79',
                pass: '11ad79315473c0',
            },
        });
    }

    public async send(payload: SendMailOptions) {
        this.transporter.sendMail(payload, (err, info) => {
            if (err) {
                throw new Error(err.message);
            }
            console.log('Email Sent!', info.messageId);
        });
    }
}

export const email: Email = new Email();
