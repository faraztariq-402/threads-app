import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxXGuWuxo9HjRzlCBO8w7WlqGa5GIObn0",
  authDomain: "threads-clone-29286.firebaseapp.com",
  projectId: "threads-clone-29286",
  storageBucket: "threads-clone-29286.appspot.com",
  messagingSenderId: "763972461983",
  appId: "1:763972461983:web:c1668ea87ac2468b1d89aa",
  measurementId: "G-4DHB611MR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
 let myEmail = document.getElementById('myEmail')
    let myPassword = document.getElementById('myPassword')
let signUpButton = document.getElementById('signUpButton')
signUpButton.addEventListener("click", function(){
   

    // const auth = getAuth();
 createUserWithEmailAndPassword(auth, myEmail.value, myPassword.value)
   .then((userCredential) => {
     // Signed in 
     const user = userCredential.user;
     alert("Sign Up Successfull")
     console.log("user created" , user)
     // ...
     window.location.href = "../threads/index.html"
   })
   .catch((error) => {
     const errorCode = error.code;
     const errorMessage = error.message;
     // ..
     alert(errorMessage);
     console.log(errorMessage)
   }); 
 })
 
const showSignUpPasswordCheckbox = document.getElementById('showSignUpPasswordCheckbox');

showSignUpPasswordCheckbox.addEventListener('change', function() {
  if (showSignUpPasswordCheckbox.checked) {
    myPassword.type = 'text';
  } else {
    myPassword.type = 'password';
  }
});