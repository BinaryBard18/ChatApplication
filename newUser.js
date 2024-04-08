//Importing Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push,get} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const chatSettings = {
    databaseURL:"https://chatnet-fe7e0-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(chatSettings);
const database = getDatabase(app);
const usersDB = ref(database,"users");

//index.html
let nameInputEl = document.getElementById("name")
let displayIDEl = document.getElementById("display--id")
let registeredEl = document.querySelector("#registered")
let getIDEl = document.getElementById("get-id")
let rememberEl = document.getElementById("remember--message")
let passEl = document.getElementById("pass")
let copyEl = document.getElementById("copy--el")

let alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$"


function assignRandomID(){
    let pass = ""
    for(let i = 0;i < 8;i++){
        let randomNumber = Math.floor(Math.random() * 65)
        pass+=alphabets[randomNumber]
    }
    return pass;
}

registeredEl.style.display = "none"

// const images = ["./girlProfilePic.png","./girlProfilePic2.png","./girlProfilePic3.png",
//                 "./girlProfilePic5.png","./girlProfilePic4.jpg","./girlProfilePic5.png",
//                 "./girlProfilePic6.png","./girlProfilePic7.png","./girlProfilePic8.png",
//                 "./girlProfilePic9.png","./manProfilePic1.jpg","./manProfilePic2.png",
//                 "./manProfilePic3.png","./manProfilePic4.png","./manProfilePic5.png",
//                 "./manProfilePic6.png","./manProfilePic7.png","./manProfilePic8.png",
//                 "./manProfilePic9.png","./manProfilePic10.png","./monster1.webp"]

const images = ["./monster1.webp","aquatic1.png","aquatic2.png","aquatic3.png","bird1.png"
                ,"bird1.png","discord1.jpg","discord2.jpg","discord3.png","discord4.png"
                ,"discord5.png","discord6.png","discord7.png","discord8.png","monster2.png"
                ,"monster3.png","monster5.png","monster6.png","aquatic4.png","aquatic5.png"];

function generateRandomIndex(){
    const index = Math.floor(Math.random() * images.length);
    return index;
}

const randomIndex = generateRandomIndex();
const randomImage = images[randomIndex];

// const images = ["./girlProfilePic.png","./girlProfilePic2.png","./girlProfilePic3.png","./girlProfilePic4.jpg","./manProfilePic1.jpg"]

// function generateRandomIndex(){
//     const index = Math.floor(Math.random() * images.length);
//     return index;
// }

getIDEl.addEventListener("click",function(){

    let user = {
        name : nameInputEl.value,
        userID : assignRandomID(),
        password : passEl.value,
        imageURL : randomImage 
    }

    if(nameInputEl.value.length>=2 && passEl.value.length>=8){

        let displayId = user.userID
        displayIDEl.innerHTML = `<p>Your UserID is : <span class="displayID">${displayId}</span></p>`
        rememberEl.textContent = "Keep your ID safe! Forgetting it means starting over and losing all your chats."
        
        let onlyID = document.querySelector(".displayID")
        onlyID.style.cssText = "cursor:pointer"
        //Copy the userID : 
        onlyID.addEventListener("click", function(){
            navigator.clipboard.writeText(onlyID.textContent);
            copyEl.textContent = "Copied!"
            copyEl.style.cssText = "background:#4975e8;border-radius:10px;padding:5px 10px;margin-top:10px"
            setTimeout(()=>{
                copyEl.textContent = ""
                copyEl.style.cssText = "background:none;border-radius:10px;padding:2px 2px"
            },5000)
        }) 

        //Hiding the Get ID button
        getIDEl.style.display = "none"
        
        //Showing up the Registered message
        registeredEl.style.display="flex"
        
        //Styling of remember message when getID button is triggered
        displayIDEl.style.fontWeight = "bold"
        
        //styling of input field when get ID button is clicked
        nameInputEl.disabled = true;
        nameInputEl.style.backgroundColor = "rgba(0, 0, 0, 0.311)"
        
        //styling of input field when get ID is triggered..
        passEl.disabled = true;
        passEl.style.backgroundColor = "rgba(0, 0, 0, 0.311)"

        //pushing the value in database
        push(usersDB, user);
    }else{
        rememberEl.textContent = "Please write your Name"
    }

    get(usersDB).then((snapshot) => {
        if (snapshot.exists()) {
          // Data exists at the specified location
          const data = Object.values(snapshot.val());
          console.log(data);
        } else {
          // No data exists at the specified location
          console.log("No data available");
        }
    })

    //What is to be given as a message when some field is not fulfilled...
    if(nameInputEl.value.length===0 && passEl.value.length===0 ){
        rememberEl.textContent = "Please Enter your Name and Password";
        return;
    }
    if(nameInputEl.value.length<2){
        rememberEl.textContent = "Name should be atleast 2 characters"
        return;
    }
    if(passEl.value.length===0){
        rememberEl.textContent = "Please Enter a Password"
        return;
    }
    if(passEl.value.length<8){
        rememberEl.textContent = "Password should be 8 characters long"
    }
})



