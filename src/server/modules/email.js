const sgMail = require('@sendgrid/mail');
const secrets = require('../config/secrets');

sgMail.setApiKey(secrets.sendgridApikey);

module.exports = async (destEmail, subject, body) => {
  try {
    const msg = {
      to: destEmail,
      from: `Chiang Mai Movies <support@andrewgolightly.com>`,
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
