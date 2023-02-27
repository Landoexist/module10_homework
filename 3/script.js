const sendBtn = document.querySelector(".send-btn");
const inputField = document.querySelector(".input-field");
const geoBtn = document.querySelector(".geolocation-btn");
const chat = document.querySelector(".chat-history");

const wsUri = "wss://echo-ws-service.herokuapp.com";
let websocket;

const hideInfo =()=>{
    document.querySelector(".info-text").innerHTML = "";
}

const displayMyMessage=()=> {
  if (chat.childNodes[1].className == "info-text") {
    hideInfo();
  }
  let newDiv = document.createElement("div");
  newDiv.className = "my-message-text";
  newDiv.innerHTML = inputField.value;
  chat.appendChild(newDiv);
}


const displayResponse=(response)=> {
  let newDiv = document.createElement("div");
  newDiv.className = "response-text";
  newDiv.innerHTML = response;
  chat.appendChild(newDiv);
  chat.lastChild.scrollIntoView();
}

const lockAction=()=> {
  sendBtn.disabled = true;
  geoBtn.disabled = true;
  inputField.disabled = true;
}

const unlockAction=()=> {
  sendBtn.disabled = false;
  geoBtn.disabled = false;
  inputField.disabled = false;
}

const showInfo=(mes)=> {
  let info = document.querySelector(".info-text");
  info.innerHTML = mes;
}

sendBtn.addEventListener("click", () => {
  displayMyMessage();
  websocket.send(inputField.value);
  inputField.value = "";
});

const success = (position)=>{
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    let newDiv = document.createElement("div");
    newDiv.className = "my-message-text";
    let mapLink = document.createElement("a");
    mapLink.href = `https://www.openstreetmap.org/#map=19/${latitude}/${longitude}`;
    mapLink.textContent = `Геолокация`;
    newDiv.appendChild(mapLink);
    chat.appendChild(newDiv);
    chat.lastChild.scrollIntoView();
}

geoBtn.addEventListener("click", ()=>{
    if (!navigator.geolocation){
        showInfo('Geolocation не поддерживается вашим браузером!');
    } else {
        hideInfo();
        navigator.geolocation.getCurrentPosition(success, ()=>showInfo('Невозможно получить ваше местоположение.'))
    }

});

document.addEventListener("DOMContentLoaded", () => {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function (evt) {
    showInfo("Вы подключены к эхо-серверу.");
    unlockAction();
  };
  websocket.onclose = function (evt) {
    showInfo("Не удалось подключиться к эхо-серверу.");
    lockAction();
  };
  websocket.onmessage = function (evt) {
    displayResponse(evt.data);
  };
  websocket.onerror = function (evt) {
    showInfo("ERROR " + evt.data);
    lockAction();
  };
});

