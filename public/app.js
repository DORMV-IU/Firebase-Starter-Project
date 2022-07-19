// DOM Initializations !!SEPERATION!!

const loginForm = document.getElementById("loginForm");
const signUpForm = document.getElementById("signUpForm");
const app = document.getElementById("app");

const logInBtn = document.getElementById("logInBtn");
const signUpBtn = document.getElementById("signUpBtn");
const logInFormBtn = document.getElementById("logInFormBtn");
const signUpFormBtn = document.getElementById("signUpFormBtn");
const logOutBtn = document.getElementById("logOutBtn");

const textEmailLogin = document.getElementById("textEmailLogin");
const textPwdLogin = document.getElementById("textPwdLogin");
const textEmailSignup = document.getElementById("textEmailSignup");
const textPwdSignup = document.getElementById("textPwdSignup");

const formErrors = document.getElementById("form-errors");

const accountModal = document.querySelector("#account-modal");
const guideModal = document.querySelector("#guide-modal");
const closeBtn = document.querySelectorAll("#close");
const accountOpenBtn = document.querySelector("#accountOpenBtn");
const guideOpenBtn = document.querySelector("#guideOpenBtn");
const guidesList = document.querySelector(".collapsible");

const modal = document.querySelectorAll(".modal");

const accountDetails = document.querySelector(".account-details");

const fileInput = document.querySelector("#guidePhoto");

accountOpenBtn.addEventListener("click", () => {
  accountModal.style.visibility = "visible";
  accountModal.style.opacity = "1";
});

guideOpenBtn.addEventListener("click", () => {
  guideModal.style.visibility = "visible";
  guideModal.style.opacity = "1";
});

closeBtn.forEach((close, i) => {
  close.addEventListener("click", () => {
    modal[i].style.opacity = "0";
    modal[i].style.visibility = "hidden";
  });
});

//PUSH DATA TO DOM !!SEPERATION!!
const setupGuides = (dataArr, user) => {
  if (dataArr.length > 0) {
    let html = ""; //for appending purposes
    dataArr.forEach((doc, i) => {
      const guide = doc.data();
      storageRef
        .child(`cover-images/${guide.title}/coverImage`)
        .getDownloadURL()
        .then((url) => {
          document.querySelectorAll(".coverImg")[i].setAttribute("src", url);
        })
        .catch((err) => {
          switch (err.code) {
            case "storage/object-not-found":
              // File doesn't exist
              console.log("File doesn't exist");
              break;
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              console.log("User doesn't have permission to access the object");

              break;
            case "storage/canceled":
              // User canceled the upload
              console.log("User canceled the upload");
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect the server response
              break;
          }
        });
      const li = `
                <li>
                  <button type="button" class="collapsible-header"><h5>${guide.title}</h5></button>
                  <div class="collapsible-body">
                    <br/>
                    <img class="coverImg" alt="${guide.title}"/><br/>
                    <p>${guide.content}</p>  
                    <br/><br/>
                    <p><b>Created:</b> ${guide.timeStamp} <br><b>Written By:</b> ${guide.author}</p>
                  </div>
                </li>
              `;

      html += li;
    });
    guidesList.innerHTML = html; //OUTPUT TO THE DOM

    //Collapsibles !!SEPERATION!!

    document.querySelectorAll(".collapsible-header").forEach((button) => {
      //not an actual button btw. its for the div with the 'collapsible' class

      button.addEventListener("click", () => {
        const content = button.nextElementSibling; //target the immediate next element within the div
        button.classList.toggle(".active"); //add / remove class

        if (button.classList.contains(".active")) {
          content.style.maxHeight = content.scrollHeight + "px";
          content.style.borderBottom = "1px dashed #1b1c1e";
          button.style.padding = "15px";
        } else {
          content.style.maxHeight = 0;
          content.style.borderBottom = "0";
          button.style.padding = "10px";
        }
      });

      window.addEventListener("resize", () => {
        const content = button.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + "px";
      });
    });
  } else {
    guidesList.innerHTML = `<p class="no-guides">No guides have been created</p>`;
  }
};

//BASIC FUNCTIONS !!SEPERATION!!
const showApp = () => {
  app.style.display = "block";
  loginForm.style.display = "none";
  signUpForm.style.display = "none";
  signUpForm.style.border = "none";
  loginForm.style.border = "none";
  document.querySelector(".error").style.display = "none";
};

const showlogin = () => {
  app.style.display = "none";
  loginForm.style.display = "block";
  signUpForm.style.display = "none";
  signUpForm.style.border = "none";
  document.querySelector(".error").style.display = "none";
};

const showSignUp = () => {
  app.style.display = "none";
  loginForm.style.display = "none";
  signUpForm.style.display = "block";
  loginForm.style.border = "none";
  document.querySelector(".error").style.display = "none";
};

//EVENT LISTENERS !!SEPERATION!!
signUpFormBtn.addEventListener("click", () => {
  showSignUp();
  loginForm.reset(); //reset login form
});

logInFormBtn.addEventListener("click", () => {
  showlogin();
  signUpForm.reset(); //reset signup form
});

//REGISTRATION !!SEPERATION!!
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault(); //Prevents page from refreshing
  const email = textEmailSignup.value; //or signUpForm['textEmailSignup'].value;
  const password = textPwdSignup.value; //or signUpForm['textPwdSignup'].value;

  // console.log(email, password);

  //Sign up the user (The process is asynchronous)
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      document.querySelector(
        "#top-word"
      ).innerHTML = `Success<span style="color: green;">!</span> <br>You are now signed up and logged in`;
      setTimeout(() => {
        document.querySelector(
          "#top-word"
        ).innerHTML = `Getting Started with <br /><span class="flash">Firebase</span>
      Authentication`;
      }, 3000);
      //ALSO REGISTER THE BIO
      return db.collection("users").doc(cred.user.uid).set({
        bio: signUpForm["bio"].value,
      });
    })
    .then(() => {
      signUpForm.reset();
    })
    .catch((error) => {
      formErrors.textContent = error.message;
      document.querySelector(".error").style.display = "flex";
      signUpForm.style.border = "2px solid red";
      signUpForm.reset();
    });
});

//Login the user !!SEPERATION!!
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = textEmailLogin.value;
  const password = textPwdLogin.value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      loginForm.reset();
      loginForm.style.border = "none";
      // showApp();
    })
    .catch((error) => {
      formErrors.textContent = "Invalid Email or Password";
      document.querySelector(".error").style.display = "flex";
      loginForm.style.border = "2px solid red";
      loginForm.reset();
    });
});

logOutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // auth.signOut().then(() => {
  //   showlogin();
  // });
  auth.signOut();
});

//CREATE NEW GUIDE !!SEPERATION!!
const createForm = document.querySelector("#create-form");

auth.onAuthStateChanged((user) => {
  if (user) {
    createForm.addEventListener("submit", (e) => {
      e.preventDefault(); //STOP REFRESH

      const selectedFile = fileInput.files[0];
      let fileRef;

      if (selectedFile) {
        fileRef = storageRef.child(
          `cover-images/${createForm["title"].value}/coverImage`
        );
        console.log(selectedFile);
        fileRef.put(selectedFile).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
      } else {
        fileRef = "";
      }

      db.collection("guides")
        .add({
          title: createForm["title"].value,
          content: createForm["content"].value,
          timeStamp: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          author: user.email,
        })
        .then(() => {
          //CLOSE THE MODAL
          //CLEAR THE FORM

          const modal = document.querySelector("#guide-modal");
          modal.style.opacity = "0";
          modal.style.visibility = "hidden";
          createForm.reset();
        })
        .catch((error) => {
          console.log(error.message + ", Dumbass");
        });
    });
  }
});

const setupUI = (user) => {
  if (user) {
    //ACCOUNT INFO
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
      <p style=' font-size: 10px;'><span style='color: #ffca2a; font-weight: bold;'>Logged in as</span> <br />${
        user.email
      }</p>
      <p style='font-size: 10px; margin-top: 20px;'><span style='color: #ffca2a; font-weight: bold;'>Biography:</span><br>${
        doc.data().bio
      }</p>
        `;
        accountDetails.innerHTML = html;
      });
  } else {
    accountDetails.innerHTML = ``;
  }
};

const imagesRef = storageRef.child("images");
