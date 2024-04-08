import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  push,
  update,
  child
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";


let hasClicked = false;

//Constantly refresh the page every 10 sec : 
// setInterval(()=>{
//   window.location.reload();
// },10000);

const chatSettings = {
  databaseURL:
    "https://chatnet-fe7e0-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(chatSettings);
const database = getDatabase(app);
const usersDB = ref(database, "users");
const grandChatsDB = ref(database, "grandChats");

let lengthOfConnectedUsers = 0;
let connectedUsers = []; //creating an empty array for the set of users with whom you are connected : used for : search tool to be possible
let chatEl = document.getElementById("new--chat");
let overlayEl = document.querySelector(".overlay");
let cancelEl = document.getElementById("cancel");
let proceedEl = document.getElementById("proceed");
let userFoundEl = document.getElementById("user-found");
let inputUserIDEl = document.getElementById("inputUserID");
let allChatsEl = document.getElementById("chats");
let myUserIdEl = document.getElementById("my--userID");
// let myUserIdEl = document.querySelector("#my--userID");
let showHideButtonEl = document.getElementById("show--hide--btn");
let show = false;
let inputSendEl = document.getElementById("input--send");
let bannerEl = document.getElementById("banner");
let userNameImageEl = document.querySelector(".userName--image");
let gifEl = document.querySelector(".FinalGif");
let copyEl = document.getElementById("copy");
let overlayTextEl = document.getElementById("overlay--text");
let inputSearchEl = document.getElementById("search-el");
let searchButtonEl = document.querySelector(".search-btn");
let chatInputEl = document.getElementById("input-el");
let chatSendBtnEl = document.getElementById("send--btn");

let storeSecondUSerID;

gifEl.style.cssText = "display:none";
overlayTextEl.style.cssText = "display:none";

overlayEl.style.display = "none";

if (chatEl) {
  chatEl.addEventListener("click", function () {
    overlayEl.style.display = "flex";
  });
}

let me = JSON.parse(localStorage.getItem("me"));
let meId = me;
myUserIdEl.innerHTML += `<span class="meraID">${meId}</span>`;

let meraIDEl = document.querySelector(".meraID");

myUserIdEl.addEventListener("click", function () {
  navigator.clipboard.writeText(meraIDEl.textContent);
  copyEl.textContent = "Copied!";
  setTimeout(() => {
    copyEl.textContent = "";
  }, 5000);
});

showHideButtonEl.addEventListener("click", function () {
  if (!show) {
    showHideButtonEl.innerHTML = `Hide your UserID <i class='bx bxs-up-arrow'>`;
    myUserIdEl.style.cssText = "display:block";
    show = true;
  } else {
    showHideButtonEl.innerHTML = `Show your UserID <i class='bx bxs-down-arrow'>`;
    myUserIdEl.style.cssText = "display:none";
    show = false;
  }
});

function goBack() {
  inputUserIDEl.value = "";
  overlayEl.style.display = "none";
  userFoundEl.textContent = "";
}

if (proceedEl) {
  proceedEl.addEventListener("click", function () {
    let idOfUser = inputUserIDEl.value;
    let found = false;
    if (idOfUser.length === 0) {
      alert("Please Enter a Id.");
    }
    if (idOfUser.length > 0 && idOfUser.length < 8) {
      alert("Please Enter a 8 character Id.");
    }

    get(usersDB).then((snapshot) => {
      if (snapshot.exists()) {
        let data = Object.values(snapshot.val());

        for (let i = 0; i < data.length; i++) {
          let item = data[i];
          if (item.userID === idOfUser) {
            get(grandChatsDB).then((snapshot) => {
              if (snapshot.exists()) {
                let chats = Object.values(snapshot.val());
                for (let i = 0; i < chats.length; i++) {
                  let el = chats[i];
                  if (idOfUser === el.users[1] && me === el.users[0]) {
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  CreateChat(idOfUser);
                  window.location.reload();
                  goBack();
                  return;
                }
                if (found) {
                  alert("You are already connected..");
                }
              } else {
                CreateChat(idOfUser);
                window.location.reload();
                goBack();
                return;
              }
            });
          }
        }
      }
    });
  });

  cancelEl.addEventListener("click", function () {
    goBack();
  });
}

function CreateChat(idOfUser) {
  let allUsersArray1 = [me, idOfUser];
  let message = [
    {
      from: "",
      content: "",
      timestamp: new Date().toString(),
    },
  ];
  let tempIdUser = idOfUser;
  let allUsersArray2 = [tempIdUser, me];
  // let message = [
  //   {
  //     from: "",
  //     content: "",
  //     timestamp: new Date().toString(),
  //   },
  // ];
  try {
    push(grandChatsDB, { users: allUsersArray1, message });
    if(me!=tempIdUser){
        push(grandChatsDB, { users: allUsersArray2, message });
    }
  } catch (error) {
    console.log("error:", error);
  }
}

get(grandChatsDB).then((snapshot) => {
  if (snapshot.exists()) {
    let chats = Object.values(snapshot.val());
    for (let i = 0; i < chats.length; i++) {
      let object = chats[i];
      let idMatch = object.users[0];
      if (idMatch === me) {
        let userName = object.users[1];
        let lastMessage = "jnjsdks";
        get(usersDB).then((snapshot) => {
          if (snapshot.exists()) {
            let user = Object.values(snapshot.val());
            for (let i = 0; i < user.length; i++) {
              let person = user[i];
              if (userName === person.userID) {
                let userID = userName;
                let image = person.imageURL;
                let nameOfPerson = person.name;
                createChatElement(nameOfPerson, lastMessage, image, userID);
              }
            }
          }
        });
      }
    }
  }
});

function createChatElement(nameOfPerson, lastMessage, image, userID) {
  const element = `
            <div id="chatEl" data-key="${userID}">
                <img src=${image} draggable="false" alt="user--brokenImage" class="profileImage">
                <div class="name--lastMessage">
                    <h2 class="nameOfUser">${nameOfPerson}</h2>
                    <p id="lastMessage">${lastMessage}</p>
                </div>
            </div>
        `;
  let userObject = {
    name: "",
    userId: userID,
    image: image,
  };

  userObject.name = nameOfPerson;
  connectedUsers.push(userObject);
  allChatsEl.innerHTML += element;
  lengthOfConnectedUsers = connectedUsers.length;
  callAgain();
  return element;
}

if (allChatsEl) {
  allChatsEl.addEventListener("click", function (event) {
    // Check if the clicked element is a chat element
    bannerEl.innerHTML = ""
    if (event.target.closest("#chatEl")) {
      // Get the data-key attribute of the clicked chat element
      const userID = event.target.closest("#chatEl").getAttribute("data-key");
      storeSecondUSerID = userID;
      console.log(storeSecondUSerID);
      // Fetch the chat data corresponding to the clicked chat

      //requried css...
      bannerEl.style.cssText =
        "height:81vh;display:flex;justify-content:center;align-items:center;font-size:1.5rem;";
      overlayTextEl.textContent = "";
      bannerEl.style.cssText =
        "background:linear-gradient(rgb(0, 0, 0,0.550),rgba(0, 0, 0,0.550),rgba(0, 0, 0,0.550)),url('lavaBackground.jpg');background-size:cover;background-position:hover;height:81vh;";
      userNameImageEl.style.cssText = "display:flex";
      inputSendEl.style.cssText = "display:flex;";

      //displaying the info on the right side
      displayInfo(userID);
      displayMessages();
    }
  });
}


setInterval(()=>{
  bannerEl.innerHTML=""
  displayMessages();
  scrollToBottom();
},10000)

function displayInfo(userID) {
  get(usersDB).then((snapshot) => {
    if (snapshot.exists()) {
      let user = userID;
      let infoArray = Object.values(snapshot.val());
      for (let i = 0; i < infoArray.length; i++) {
        let item = infoArray[i];
        if (item.userID === user) {
          let name = item.name;
          let image = item.imageURL;
          // console.log(name,image);
          Info(name, image);
          break;
        }
      }
    }
  });
}

function displayMessages() {
  get(grandChatsDB).then((snapshot) => {
    if (snapshot.exists()) {
      let allChats = Object.values(snapshot.val());
      for (let i = 0; i < allChats.length; i++) {
        let item = allChats[i];
        if (item.users[0] === me && item.users[1] === storeSecondUSerID) {
          for (let i = 0; i < item?.message.length; i++) {
            if (item.message[i].from === me) {
              let rightMessage = item.message[i].content;
              // console.log(rightMessage);
              if(rightMessage.length>0){
                renderMessageRight(rightMessage);
              }
            } else {
              let leftMessage = item.message[i].content;
              // console.log(leftMessage);
              if(leftMessage.length>0){
                renderMessageLeft(leftMessage);
              }
            }
          }
        }
      }
    }
  });
}

chatSendBtnEl.addEventListener("click", function () {
  let chatValue = chatInputEl.value;
  if (chatValue.length > 0) {
    bannerEl.innerHTML = "";
    get(grandChatsDB).then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();


        for (let i in data) {
        let item = data[i]

          //Storing in the first message : 
          //Assuming that first user in the users Array is on desk : 
          if ((item.users[0] === me ) && (item.users[1] === storeSecondUSerID)) {
              let postData = { content: chatValue,
                  from: me,
                  timestamp: new Date().toString()
              }
              
              let message = item.message
              if(message){
                message.push(postData)
              }
              const userRef = child(grandChatsDB, i);
              update(userRef, {
                  message: message
              });
          }

          //Storing in the second message : 
          //Assuming 2nd user in users Array is on the desk : 
          if(me!=storeSecondUSerID){
            if (( item.users[0] === storeSecondUSerID) && (item.users[1] === me)) {
              let postData = { content: chatValue,
                  from: me,
                  timestamp: new Date().toString()
              }
              
              let message = item.message;
              if(message){
                message.push(postData);
              }
              const userRef = child(grandChatsDB, i);
              update(userRef, {
                  message: message
              });
              
            }
          }
           
          }
        }
    displayMessages();
      
    });
    chatInputEl.value = "";
  } else {
    alert("Type in a message to send...");
  }
});
function renderMessageRight(rightMessage){
    const element = `<div id="right--texts">${rightMessage}</div>`;
    bannerEl.innerHTML+=element;
}

function renderMessageLeft(leftMessage){
    const element = `<div id="texts">${leftMessage}</div>`;
    bannerEl.innerHTML+=element;
}

document.addEventListener("keydown", function (event) {

  if (event.key === "Escape") {
    bannerEl.innerHTML = ""
    bannerEl.style.cssText =
      "height:100%;display:flex;justify-content:center;align-items:center;font-size:1.5rem;";
    overlayTextEl.style.cssText =
      "font-size:2rem;user-select:none;font-family:Comic Sans MS;display:flex;justify-content:center;align-items:center;height:inherit";
    overlayTextEl.textContent =
      "Start chatting with connected friends, or start a new one!";
    bannerEl.style.cssText =
      "background-image:linear-gradient(rgba(0, 0, 0, 0.763),rgba(0, 0, 0, 0.763),rgba(0, 0, 0, 0.763)),url(./chatDoodling.jpg);height:100%;background-position:center";
    gifEl.style.cssText = "display:none";
    userNameImageEl.style.cssText = "display:none";
  }
});

function scrollToBottom() {
  var bannerEl = document.getElementById("banner");
  bannerEl.scrollTop = bannerEl.scrollHeight;
}

function Info(name, image) {
  const info = `<img src="${image}" id="profile--image" draggable="false" alt="broken--profile">
                  <h1 id="user--name--right">${name}</h1>`;
  userNameImageEl.innerHTML = info;
}

function callAgain() {
  // console.log(lengthOfConnectedUsers);
  if (lengthOfConnectedUsers === 0) {
    bannerEl.style.cssText = "height:inherit";
    // bannerEl.textContent = "Start chatting with connected friends, or start a new one! "
    inputSendEl.style.cssText = "display:none";
    userNameImageEl.style.cssText = "display:none";
    gifEl.style.cssText = "display:block";
  } else {
    bannerEl.style.cssText =
      "height:100vh;display:flex;justify-content:center;align-items:center;font-size:1.5rem;";
    overlayTextEl.style.cssText =
      "font-size:2rem;user-select:none;font-family:Comic Sans MS;display:flex;justify-content:center;align-items:center;height:inherit";
    overlayTextEl.textContent =
      "Start chatting with connected friends, or start a new one!";
    bannerEl.style.cssText =
      "background-image:linear-gradient(rgba(0, 0, 0, 0.763),rgba(0, 0, 0, 0.763),rgba(0, 0, 0, 0.763)),url(./chatDoodling.jpg);height:100vh;background-position:center";
    // i    nputSendEl.style.cssText = "display:flex";
    // userNameImageEl.style.cssText = "display:flex";
    gifEl.style.cssText = "display:none";
  }
}

callAgain(); //Important

function filterUsers(searchText, userIdInput) {
  let foundEl = [];
  for (let i = 0; i < lengthOfConnectedUsers; i++) {
    let user = connectedUsers[i];
    if (user.name.toLowerCase().includes(searchText)) {
      foundEl.push(user);
    }
    if (user.userId.includes(userIdInput)) {
      foundEl.push(user);
    }
  }
  if (foundEl) {
    allChatsEl.innerHTML = "";
  }
  return foundEl;
}

// grandChatsDB.on('value', function(snapshot) {
//     // Refresh the page whenever there is a change in the database
//     if(snapshot.exists()){
//         window.location.reload(true);
//     }
// });


function displayFilteredUsers(foundEl) {
  for (let i = 0; i < foundEl.length; i++) {
    const element = `
                <div id="chatEl">
                    <img src=${foundEl[i].image} draggable="false" alt="user--brokenImage" class="profileImage">
                    <div class="name--lastMessage">
                        <h2 class="nameOfUser">${foundEl[i].name}</h2>
                        <p id="lastMessage">HelloBrother</p>
                    </div>
                </div>
            `;

    allChatsEl.innerHTML += element;
  }
  console.log(foundEl);
}

searchButtonEl.addEventListener("click", function () {
  let idInput = inputSearchEl.value;
  let searchText = "";
  let userIdInput = idInput;
  searchText = idInput.toLowerCase();
  let filteredUsers = filterUsers(searchText, userIdInput);
  displayFilteredUsers(filteredUsers);
  if (searchText.length === 0) {
    window.location.reload();
  }
});

