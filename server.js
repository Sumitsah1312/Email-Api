import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mail API is running...");
});

app.post("/PortfolioConnectMail", async (req, res) => {
  try {
    const { Name, EmailId, Mobile, Message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🧩 HTML Email Template (converted from your C# StringBuilder)
    const htmlBody = `
      <head>
        <title></title>
      </head>
      <body style="font-size: 10pt; font-family: Calibri;">
        <table width="100%" cellspacing="0" cellpadding="0" 
          style="border:1px solid #4c7a5d; border-radius:20px; background-color:#7655a573;">
          <tbody style="font-size: 12pt; font-family: Calibri;">
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
              <td colspan="2" style="padding-left:10px; font-size:15px;">
                <strong>${Name}</strong> wants to connect with you.
              </td>
            </tr>
            <tr><td colspan="2">&nbsp;</td></tr>
            <tr>
              <td align="left" colspan="2">
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="font-family: Calibri; font-size: 12px; color:black; border-collapse:collapse;">
                  <tr>
                    <td colspan="2" style="padding-left:10px; font-size:15px;">
                      <strong>Email:</strong> ${EmailId}
                    </td>
                  </tr>
                  <tr><td colspan="2" style="padding-left:10px;"><br/></td></tr>
                  <tr>
                    <td colspan="2" style="padding-left:10px; font-size:15px;">
                      <strong>Mobile:</strong> ${Mobile}
                    </td>
                  </tr>
                  <tr><td colspan="2" style="padding-left:10px;"><br/></td></tr>
                  <tr>
                    <td colspan="2" style="padding-left:10px; font-size:15px;">
                      ${Message}
                    </td>
                  </tr>
                  <tr><td colspan="2" style="padding-left:10px;"><br/></td></tr>
                </table>
              </td>
            </tr>
            <tr><td>&nbsp;</td></tr>
          </tbody>
        </table>
        <br><br>
      </body>
    `;
 
    // 📨 Send the email
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: `${EmailId}`, // Send to yourself or admin
      subject: `${Name} wants to connect with you.`,
      html: htmlBody,
    });

    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("✅ Mail API running on port 5000"));
