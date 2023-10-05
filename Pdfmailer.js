const fs = require("fs");
const nodemailer = require("nodemailer");
const pdf = require("html-pdf");
const PdfTemplate = require("./PdfTemplate");


async function generatePDF(data) {
  const htmlContent = PdfTemplate(data);
  const pdfOptions = {
    format: "Letter",
    margin: {
      top: "10mm",
      right: "10mm",
      bottom: "10mm",
      left: "10mm",
    },
  };

  const pdfPath = "generated.pdf"; // Path to save the generated PDF
  await new Promise((resolve, reject) => {
    pdf.create(htmlContent, pdfOptions).toFile(pdfPath, (err) => {
      if (err) {
        console.error("PDF generation error:", err);
        return reject(err);
      }
      resolve();
    });
  });

  // Read PDF file
  const pdfBytes = fs.readFileSync(pdfPath);

  return pdfBytes;
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
        filename: "generated.pdf",
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
