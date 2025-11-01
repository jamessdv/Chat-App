const socket = io("http://localhost:5000");

function joinRoom() {
  const userName = document.getElementById("userName").value.trim();
  const roomName = document.getElementById("roomName").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!userName || !roomName || !password) {
    alert("Please fill all fields!");
    return;
  }

  socket.emit("joinRoom", { roomName, password, userName }, (res) => {
    if (res.success) {
      localStorage.setItem("userName", userName);
      localStorage.setItem("roomName", roomName);
      localStorage.setItem("password", password);
      window.location.href = "chat.html";
    } else {
      alert(res.message);
    }
  });
}
