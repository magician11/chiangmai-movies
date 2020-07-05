const functions = require('firebase-functions');
const sendEmail = require('./email');

exports.createUser = functions.firestore
  .document('errors/{errorId}')
  .onCreate((snap, context) => {
    sendEmail(
      functions.config().admin.email,
      'Error with Chiang Mai Movies UI',
      JSON.stringify(snap.data())
    );
  });
