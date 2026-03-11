// התחברות לשרת הסוקט בפורט הנוכחי
const socket = io();

const h1 = document.querySelector("h1");
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

// משתנים מקומיים (נשתמש בהם כברירת מחדל)
let myUsername = "unknown";
let myColor = "#000000";

// --- סעיף 3: פונקציה לעדכון פרופיל ---
function updateProfile() {
  const name = document.getElementById("username").value;
  const color = document.getElementById("userColor").value;

  if (name.trim() === "") {
    alert("בבקשה תכתבי שם משתמש");
    return;
  }

  myUsername = name;
  myColor = color;

  // שליחת האירוע לשרת
  socket.emit("update_user_details", {
    username: name,
    color: color,
  });

  alert("הפרטים נשמרו בהצלחה!");
}

// שליחת הודעה
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit("new message", message);
    input.value = "";
  }
});

// עדכון כותרת בחיבור
socket.on("user connected", ({ userId }) => {
  h1.textContent = `Simple Chat - user ${userId}`;
});

// --- סעיף 4: הצגת הודעה עם שם וצבע ---
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

// --- סעיף 5: פונקציית התנתקות (הוספנו כאן) ---
function disconnectMe() {
  // פקודה שמנתקת את הסוקט מהשרת
  socket.disconnect();

  alert("התנתקת מהצ'אט בהצלחה!");

  // הצגת הודעה ויזואלית למשתמש שהוא התנתק
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
