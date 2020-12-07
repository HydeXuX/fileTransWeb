//appendChild( )
// removeChild( )
// createElement( )
// createTextNode( )
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var database = firebase.database();
const auth = firebase.auth();
const logInBtn = document.getElementById('login');
const sendTxtBtn = document.getElementById('sendBtn');
const fileChoose = document.getElementById('chooseFile');
const dbRefObj = database.ref().child('chats');
const imgType = "img";
const msgType = "msg";
const fileType = "file";
const fileName = "msg";
const type = "msg";
var isPhone = 0;
var logoutBtn = document.getElementById('logout');
let main = document.querySelector('.main');
let ul = document.getElementById('chatList');
var index = 0;
main.appendChild(ul);

class Chat{
  constructor({detail,fileName,isPhone,type,userId}){
    this.detail = detail;
    this.fileName = fileName;
    this.isPhone = isPhone;
    this.type = type;
    this.userId = userId;
  }
  getDetail(){ return this.detail;}
  getFileName(){ return this.fileName;}
  getIsPhone(){ return this.isPhone;}
  getType(){ return this.type;}
  getUserId(){ return this.userId;}
}

//logout feature
logout.addEventListener('click', e =>{
  firebase.auth().signOut()
    .then((user)=>{
      console.log("Signed out");
      window.location = "index.html"
    })
    .catch((error)=>{
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    })
});

//Sync obj changes
dbRefObj.on('child_added',snap => {
  myChat = new Chat (snap.val());
  // console.log("detail: "+myChat.getDetail());
  // console.log("fileName: "+myChat.getFileName());
  // console.log("isPhone: "+myChat.getIsPhone());
  // console.log("type: "+myChat.getType());
  // console.log("userId: "+myChat.getUserId());
  if (myChat.getUserId() == firebase.auth().currentUser.uid) {
    if (myChat.getType() == imgType) {
      displayImg(myChat);
    }
    else if (myChat.getType() == msgType) {
      displayMsg(myChat);
    }
    else if (myChat.getType() == fileType) {
      displayFile(myChat);
    }
  }
});

//Send text feature
sendTxtBtn.addEventListener('click', e =>{
  var detail = document.getElementById('userInput').value;
  var userId = firebase.auth().currentUser.uid;
  console.log({detail, msgType, isPhone, msgType, userId});
  newChat = new Chat({detail, type, isPhone, fileName, userId});
  console.log(newChat);
  dbRefObj.push().set(newChat);
  document.getElementById('userInput').value = " ";
});

//Choose file feature
fileChoose.addEventListener('change', e=>{
  var file = e.target.files[0];
  var storageRef = firebase.storage().ref('files/' + file.name);
  var task = storageRef.put(file);
  var detail;
  storageRef.getDownloadURL().then(function(url) {
    console.log(url);
    detail = url;
    var userId = firebase.auth().currentUser.uid;
    console.log({detail, msgType, isPhone, msgType, userId});
    var type = "file";
    var fileName = file.name;
    newChat = new Chat({detail, type, isPhone, fileName, userId});
    console.log(newChat);
    dbRefObj.push().set(newChat);
  });

});

function displayImg(myChat){
  let li = document.createElement('li');
  var name = document.createTextNode(myChat.getFileName());
  var a = document.createElement('a');
  let newImg = document.createElement('img');
  newImg.src = myChat.getDetail();
  a.setAttribute('href', myChat.getDetail());
  a.setAttribute('download', myChat.getFileName());
  a.appendChild(newImg)
  li.appendChild(a);
  ul.appendChild(li);
  //li.style.color = "white";
  if (myChat.getIsPhone() == 1) {
    ul.style.textAlign = "left";
    li.style.textAlign = "left";
    li.style.marginLeft = "-30px";
    console.log(myChat.getFileName()+ " is left");
  }
  else {
    ul.style.textAlign = "right";
    li.style.textAlign = "right";
    li.style.marginRight = "10px";
    console.log(myChat.getFileName()+ " is right");
  }
  li.style.fontFamily = "open-sans";
  newImg.style.height = "200px";
  newImg.style.maxWidth = "200px";
  updateScroll();
}

function displayFile(myChat){
  let li = document.createElement('li');
  var name = document.createTextNode(myChat.getFileName());
  let div = document.createElement('div');
  div.id = "fileBox"
  var a = document.createElement('a');
  let fileNameDisplay = document.createElement('p');
  fileNameDisplay.appendChild(name);
  div.appendChild(fileNameDisplay);
  a.setAttribute('href', myChat.getDetail());
  a.setAttribute('download', name);
  a.appendChild(div)
  li.appendChild(a);
  ul.appendChild(li);
  //li.style.color = "white";
  if (myChat.getIsPhone() == 1) {
    ul.style.textAlign = "left";
    li.style.textAlign = "left";
    li.style.marginLeft = "-30px";
    li.style.marginRight = "20px";
    console.log(myChat.getFileName()+ " is left");
  }
  else {
    ul.style.textAlign = "right";
    li.style.textAlign = "right";
    //li.style.float = "right";
    div.style.textAlign = "right";
    div.style.marginRight = "10px";
    div.style.marginLeft = "auto";
    console.log(myChat.getFileName()+ " is right");
  }
  li.style.fontFamily = "open-sans";
  div.style.backgroundColor = "#00BCD4";
  updateScroll();
}

function displayMsg(myChat){
  let li = document.createElement('li');
  let p = document.createElement('p');
  let div = document.createElement('div');
  let msg = document.createTextNode(myChat.getDetail());
  p.appendChild(msg);
  div.appendChild(p);
  li.appendChild(div);
  ul.appendChild(li);

  if (myChat.getIsPhone() == 1) {
    ul.style.textAlign = "left";
    li.style.textAlign = "left";
    li.style.marginLeft = "-30px";
    li.style.marginRight = "20px";
    console.log(myChat.getDetail()+ " is left");
  }
  else {
    ul.style.textAlign = "right";
    li.style.textAlign = "right";
    //li.style.float = "right";
    div.style.textAlign = "right";
    div.style.marginRight = "10px";
    div.style.marginLeft = "auto";
    console.log(myChat.getDetail()+ " is right");
  }
  div.style.backgroundColor = "#00BCD4";
  div.id = "chatBox"
  p.style.padding = "8px";
  updateScroll();

}

function updateScroll(){
    var element = document.getElementById("chatList");
    element.scrollTop = element.scrollHeight;
}
