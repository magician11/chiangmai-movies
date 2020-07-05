const sgMail = require('@sendgrid/mail');
const functions = require('firebase-functions');

sgMail.setApiKey(functions.config().sendgrid.apikey);

module.exports = async (destEmail, subject, body) => {
  try {
    const msg = {
      to: destEmail,
      from: `Chiang Mai Movies <${functions.config().admin.email}>`,
      subject: subject,
      html: body
    };
    await sgMail.send(msg);
    console.log(`Email sent to ${destEmail} for ${subject}: ${body}`);
  } catch (error) {
    throw new Error(
      `Error with sending email through sendgrid: ${error.message}`
    );
  }
};
