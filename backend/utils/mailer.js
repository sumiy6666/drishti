const AWS = require('aws-sdk');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1'
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.send = async ({ to, subject, html, text }) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL || process.env.FROM_EMAIL || 'no-reply@konnectt.in',
    subject,
    text: text || "",
    html
  };

  // Try SendGrid first
  if (process.env.SENDGRID_API_KEY) {
    try {
      const result = await sgMail.send(msg);
      console.log("Email sent successfully via SendGrid");
      return result;
    } catch (error) {
      console.error("SendGrid Error:", error.response ? error.response.body : error);
      console.log("Attempting fallback to AWS SES...");
    }
  } else {
    console.log("SendGrid API Key missing, using AWS SES...");
  }

  // Fallback to AWS SES
  const params = {
    Destination: { ToAddresses: [to] },
    Message: {
      Body: {
        Html: { Charset: "UTF-8", Data: html },
        Text: { Charset: "UTF-8", Data: text || "" }
      },
      Subject: { Charset: 'UTF-8', Data: subject }
    },
    Source: process.env.FROM_EMAIL || 'no-reply@konnectt.in'
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent successfully via AWS SES");
    return result;
  } catch (error) {
    console.error("SES Fallback Error:", error);
    throw error; // If both fail, throw the last error
  }
};
