import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/PortfolioConnectMail", async (req, res) => {
  try {
    const { Name, EmailId, Mobile, Message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlBody = `
      <body style="font-size: 10pt; font-family: Calibri;">
        <table width="100%" cellspacing="0" cellpadding="0" 
          style="border:1px solid #4c7a5d; border-radius:20px; background-color:#7655a573;">
          <tbody>
            <tr><td style="padding-left:10px; font-size:15px;">
              <strong>${Name}</strong> wants to connect with you.<br/>
              <strong>Email:</strong> ${EmailId}<br/>
              <strong>Mobile:</strong> ${Mobile}<br/>
              ${Message}
            </td></tr>
          </tbody>
        </table>
      </body>
    `;

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself, not the user
      subject: `${Name} wants to connect with you.`,
      html: htmlBody,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Export for Vercel
export const handler = serverless(app);
