const chatBox = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");

let messages = [];

function renderMessage(role, content) {
  const div = document.createElement("div");
  div.textContent = `${role === "user" ? "You" : "Assistant"}: ${content}`;
  chatBox.appendChild(div);
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  messages.push({ role: "user", content: userText });
  renderMessage("user", userText);
  userInput.value = "";

  const response = await fetch("/diagnose", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();
  const reply = data.response;
  messages.push({ role: "assistant", content: reply });
  renderMessage("assistant", reply);
});
