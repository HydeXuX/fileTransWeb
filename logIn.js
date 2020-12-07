firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const logInBtn = document.getElementById('login');
var database = firebase.database();
const dbRefObj = database.ref().child('chats');


//Login function
logInBtn.addEventListener('click', e =>{
  var email = document.getElementById('email').value;
  var password = document.getElementById('pass').value;
  console.log(password);
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user)=>{
      console.log("Signed In");
      window.location = "mainPage.html"
    })
    .catch((error)=>{
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    })
});
