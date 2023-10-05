const puppeteer = require("puppeteer");
const fs = require("fs");
const nodemailer = require("nodemailer");

async function generatePDF(data) {
  const browser = await puppeteer.launch({
    executablePath: "/path/to/chromium",
  });
  const page = await browser.newPage();

  // Load the HTML template and replace placeholders with data
  const htmlContent = fs.readFileSync("template.html", "utf8");
  const filledHtml = htmlContent
    .replace("{{title}}", data.title)
    .replace("{{content}}", data.content);

  await page.setContent(filledHtml);

  // Generate the PDF
  const pdfBuffer = await page.pdf();

  await browser.close();

  return pdfBuffer;
}

async function sendEmail(pdfBuffer, recipientEmail) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "eclecticatmsl23@gmail.com",
      pass: "okotejdvjinfjwff",
    },
  });

  const mailOptions = {
    from: "eclecticatmsl23@gmail.com",
    to: recipientEmail,
    subject: "PDF Attachment",
    text: "Please find the attached PDF.",
    attachments: [
      {
        filename: "document.pdf",
        content: pdfBuffer,
      },
    ],
  };

  // Send the email with the PDF attachment
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { sendEmail, generatePDF };
