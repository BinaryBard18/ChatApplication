import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const chatSettings = {
    databaseURL:"https://chatnet-fe7e0-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(chatSettings);
const database = getDatabase(app);
const usersDB = ref(database,"users");

let me = ""

// existingUser.html
let existingUserEl = document.getElementById("existing--userID")
let passwordEl = document.getElementById("password--el")
let letsChatEl = document.querySelector("#lets-chat")
let alertEl = document.getElementById("alert")
let AlertEl = document.getElementById("alert--el")
let Chat2El = document.getElementById("lets-chat-btn")


get(usersDB).then((snapshot) => {
    if (snapshot.exists()) {
      const data = Object.values(snapshot.val());
      let found = false
      for(let i=0;i<data.length;i++){
          let item = data[i];
          letsChatEl.addEventListener("click", function(){
            if(existingUserEl.value.length===0 && passwordEl.value.length===0){
                  AlertEl.textContent = "Please enter the ID and Password"
                  alertEl.textContent = ""
                  return;
              }
            if(existingUserEl.value.length!=8){
                AlertEl.textContent = "The Unique ID is 8 characters long."
                return;
            }
            if(passwordEl.value.length===0){
                AlertEl.textContent = "Please Enter the password"
                return;
            }
            if(passwordEl.value.length<8){
                AlertEl.textContent = "The Password is atleast 8 characters long."
                return;
            }
            AlertEl.textContent = ""
            if(item.userID === existingUserEl.value && item.password === passwordEl.value){
                alertEl.style.color = "lightgreen"
                alertEl.textContent = "Credentials matched.";
                found = true;
                me = existingUserEl.value;
                letsChatEl.style.display = "none"
                Chat2El.style.display = "block"

                localStorage.setItem("me",JSON.stringify(me));

                return;//Exits the loop
            }
            if(!found){
                alertEl.textContent = "Credentials doesn't match"
            }
        })
      }
    } else {
      console.log("No data available");
    }
})