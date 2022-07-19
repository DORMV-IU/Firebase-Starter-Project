const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(); //INITIALIZE THE APP SERVERSIDE

exports.addAdminRole = functions.https.onCall((data, context) => {
  //GET USER AND ADD CUSTOM CLAIM (ADMIN ROLE)
  //The function itself returns a promise. In order to return it over all, we are returning it from the function itself.
  return admin.auth
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin`,
      };
    })
    .catch((err) => {
      return err.message;
    });
});
