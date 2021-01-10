const firebaseConfig = {
  apiKey: "AIzaSyAmHSD4qpxdjKY8wRkhbqUVvJ1lY8_aHt8",
  authDomain: "adh-analyser.firebaseapp.com",
  databaseURL: "https://adh-analyser-default-rtdb.firebaseio.com",
  projectId: "adh-analyser",
  storageBucket: "adh-analyser.appspot.com",
  messagingSenderId: "1074482678407",
  appId: "1:1074482678407:web:ee368e1e36fe4c4fcc0622",
  measurementId: "G-L3RLFF3F17"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var collection = db.collection("users");

document.getElementById('registerform').addEventListener("submit", (event) => {
  event.preventDefault();
  const username = event.target.usernameSignup.value;
  const email = event.target.emailSignup.value;
  const password = event.target.passSignup.value;
  const recaptcha = document.getElementById('g-recaptcha-response-1').value;

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  
  if(recaptcha === ''){
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Please tick the recaptcha";
    showSnackbar();
    // untick in recaptcha
  }
  else if(email === "" || password === "" || username === ""){
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Please Fill the Username, Email and Password";
    showSnackbar();
  }
  else{
    fetch("/verifyrecaptcha", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
      },
      body: JSON.stringify({ recaptcha }),
    })
    .then((res) => {
      if(res.status === 401){
        var sk = document.getElementById("sk-bar");
        sk.innerHTML = "Invalid recaptcha";
        showSnackbar();
      }
      else{
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch((err) => {
          if(err.code === "auth/email-already-in-use"){
            grecaptcha.reset();
            var sk = document.getElementById("sk-bar");
            sk.innerHTML = "Email already Registered";
            showSnackbar();
          }
          return false;
        })
        .then(() => {
          firebase.auth().currentUser.sendEmailVerification().then(function() {
            console.log("Be Happy");
            var sk = document.getElementById("sk-bar");
            sk.innerHTML = "Please Verify your Email";
            showSnackbar();
          }, function(error) {
            console.log(error.message);
          });
        })
        .then(() => {
          collection.doc(firebase.auth().currentUser.uid).set({
            Name : username,
            Email : email
          });
        })
        .then(() => {
          return firebase.auth().signOut();
        })
        .then(() => {
          setTimeout(function(){ 
            window.location.assign("/login");
          }, 3000);
        });
        return false;
      }
    });
  }     
});

document.getElementById('loginform').addEventListener("submit", (event) => {
  event.preventDefault();
  const email = event.target.emailSignin.value;
  const password = event.target.passSignin.value;
  const recaptcha = document.getElementById('g-recaptcha-response').value;

  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
  
  if(recaptcha === ''){
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Please tick the recaptcha";
    showSnackbar();
    // untick in recaptcha
  }
  else if(email === "" || password === ""){
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Please fill the email and password";
    showSnackbar();
  }
  else{
    fetch("/verifyrecaptcha", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
      },
      body: JSON.stringify({ recaptcha }),
    })
    .then((res) => {
      if(res.status === 401){
        var sk = document.getElementById("sk-bar");
        sk.innerHTML = "Invalid recaptcha";
        showSnackbar();
      }
      else{
        firebase.auth().signInWithEmailAndPassword(email, password)
        .catch((err) => {
          if(err.code === "auth/user-not-found"){
            grecaptcha.reset();
            var sk = document.getElementById("sk-bar");
            sk.innerHTML = "Invalid Email and Password";
            showSnackbar();
          }
          else if(err.code === "auth/wrong-password"){
            grecaptcha.reset();
            var sk = document.getElementById("sk-bar");
            sk.innerHTML = "Wrong Password";
            showSnackbar();
          }
          return false;
        })
        .then(({ user }) => {
          if(firebase.auth().currentUser.emailVerified){
            return user.getIdToken().then((idToken) => {
              return fetch("/sessionLogin", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({ idToken }),
              });
            });
          }
          else{
            grecaptcha.reset();
            var sk = document.getElementById("sk-bar");
            sk.innerHTML = "Please Verify your email";
            showSnackbar();
            return false;
          }
        })
        .then(() => {
          return firebase.auth().signOut();
        })
        .then(() => {
          window.location.assign("/home");
        });
        return false;
      }
    });
  }
});

function googleSignin() {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
  .catch((error) => {
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Some error accured";
    showSnackbar();
  })
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    return firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      return fetch("/sessionLogin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body: JSON.stringify({ idToken }),
      });
    }).catch(function(error) {
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Some error accured";
      showSnackbar();
    });
  })
  .then(() => {
    return firebase.auth().signOut();
  })
  .then(() => {
    window.location.assign("/home");
  });
  return false;
}
function facebookSignin() {
  var provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
  .catch((error) => {
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Some error accured";
    showSnackbar();
  })
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    return firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      return fetch("/sessionLogin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body: JSON.stringify({ idToken }),
      });
    }).catch(function(error) {
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Some error accured";
      showSnackbar();
    });
  })
  .then(() => {
    return firebase.auth().signOut();
  })
  .then(() => {
    window.location.assign("/home");
  });
  return false;
}
function twitterSignin() {
  var provider = new firebase.auth.TwitterAuthProvider();
  firebase.auth().signInWithPopup(provider)
  .catch((error) => {
    var sk = document.getElementById("sk-bar");
    sk.innerHTML = "Some error accured";
    showSnackbar();
  })
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    return firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      return fetch("/sessionLogin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body: JSON.stringify({ idToken }),
      });
    }).catch(function(error) {
      var sk = document.getElementById("sk-bar");
      sk.innerHTML = "Some error accured";
      showSnackbar();
    });
  })
  .then(() => {
    return firebase.auth().signOut();
  })
  .then(() => {
    window.location.assign("/home");
  });
  return false;
}
function showSignUp(){
  document.getElementById('sign-in-body').setAttribute("style", "display: none;");
  document.getElementById('sign-up-body').setAttribute("style", "display: block;");
}
function showSignIn(){
  document.getElementById('sign-up-body').setAttribute("style", "display: none;");
  document.getElementById('sign-in-body').setAttribute("style", "display: block;");
}
function showSnackbar() {
  var x = document.getElementById("sk-bar");
  x.classList.toggle("show"); 
  setTimeout(function(){ 
    x.classList.toggle("show"); 
  }, 3000);
}