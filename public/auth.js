// Make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

//Update firestore settings (how timestamps will work with firestore)
db.settings({ timestampsInSnapshots: true });

// LISTEN FOR AUTH STATUS CHANGES !!SEPERATION!!
let authToggle = true;
if (authToggle) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      showApp();
      // Get Data !!SEPERATION!!
      db.collection("guides").onSnapshot(
        (snapshot) => {
          setupGuides(snapshot.docs, user);
        },
        (err) => {
          console.log(err.message);
        }
      );
      setupUI(user);
    } else {
      setupGuides([]);
      showlogin(); //EMPTY ARRAY
    }
  });
}
/*TODO

1. fix collapsable DONE
2. allow addition of data
*/
