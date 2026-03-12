const socket = io();

const h1 = document.querySelector("h1");
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

let myUsername = "unknown";
let myColor = "#000000";

function updateProfile() {
  const name = document.getElementById("username").value;
  const color = document.getElementById("userColor").value;

  if (name.trim() === "") {
    alert("בבקשה תכתבי שם משתמש");
    return;
  }

  myUsername = name;
  myColor = color;

  socket.emit("update_user_details", {
    username: name,
    color: color,
  });

  alert("הפרטים נשמרו בהצלחה!");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit("new message", message);
    input.value = "";
  }
});

socket.on("user connected", ({ userId }) => {
  h1.textContent = `Simple Chat - user ${userId}`;
});

socket.on("send message", (msgFromServer) => {
  console.log("Message received from server:", msgFromServer);

  const item = document.createElement("li");

  let displayName = msgFromServer.by;
  if (!isNaN(msgFromServer.by) && myUsername !== "unknown") {
    displayName = myUsername;
  }

  item.textContent = `${displayName}: ${msgFromServer.msg}`;

  if (msgFromServer.color) {
    item.style.color = msgFromServer.color;
  } else {
    item.style.color = "black";
  }

  messages.append(item);
  messages.scrollTop = messages.scrollHeight;
});

function disconnectMe() {
  socket.disconnect();

  alert("התנתקת מהצ'אט בהצלחה!");

  const item = document.createElement("li");
  item.innerHTML = "<b>אתה כבר לא מחובר לצ'אט.</b>";
  item.style.color = "red";
  messages.append(item);
}
socket.on("update_count", (count) => {
  console.log("מספר מחוברים שהתקבל מהשרת:", count);
  const counterElement = document.getElementById("counter");
  if (counterElement) {
    counterElement.textContent = count;
  }
});
