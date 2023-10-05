const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { generatePDF, sendEmail } = require("./Pdfmailer");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/generate-pdf-and-send", async (req, res) => {
  try {
    const data = {
      title: "alok",
      content: "kumar",
    };

    const pdfBuffer = await generatePDF(data);

    const recipientEmail = req.body.email;
    await sendEmail(pdfBuffer, recipientEmail);

    res.status(200).send("PDF sent successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error.");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
