import nodemailer from "nodemailer";
import config from "../config/index.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.mail_user,
        pass: config.mail_pass
    }
})

export const sendForgotPasswordEmail = async (email, resetToken) => {
    const resetLink =
        `${config.frontend_url}/reset-password/${resetToken}`;

    const mailOptions = {
        from: config.mail_user,
        to: email,
        subject: "Reset Your Password",
        html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:30px;">

                <div style="
                    max-width:500px;
                    margin:auto;
                    background:#ffffff;
                    padding:30px;
                    border-radius:10px;
                    box-shadow:0 4px 15px rgba(0,0,0,0.08);
                ">

                    <h2 style="text-align:center;">
                        Reset Your Password
                    </h2>

                    <p>
                        We received a request to reset your password.
                    </p>

                    <p>
                        Click the button below to create a new password.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                        <a
                            href="${resetLink}"
                            style="
                                background:#6D8196;
                                color:white;
                                padding:12px 25px;
                                text-decoration:none;
                                border-radius:6px;
                                display:inline-block;
                            "
                        >
                            Reset Password
                        </a>
                    </div>

                    <p>
                        This link will expire after a limited time.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <p>
                        Thanks,<br>
                        Your Team
                    </p>

                </div>

            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};
