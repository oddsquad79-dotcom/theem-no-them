const output = document.getElementById("output");
const form = document.getElementById("terminalForm");
const input = document.getElementById("command");

const responses = {
  help: [
    "available commands:",
    "about: who is this?",
    "specs: show the machine",
    "stack: show the current stack",
    "socials: show contact links",
    "clear: clear the terminal"
  ],
  about: [
    "→ Jashan / ZeroOrder",
    "→ messing with clicks",
    "→ JavaScript · PHP · HTML · CSS"
  ],
  specs: [
    "→ Dell Latitude 5480",
    "→ Intel Core i5-7440HQ",
    "→ Intel HD Graphics 630",
    "→ 8 GB RAM / 256 GB storage",
    "→ 1366×768 @ 60 Hz",
    "→ Fedora Linux 44 / KDE Plasma / Wayland"
  ],
  stack: [
    "→ JavaScript",
    "→ PHP",
    "→ HTML",
    "→ CSS"
  ],
  socials: [
    "→ Discord: khushpree1",
    "→ discord.com/users/1391256641340575784"
  ]
};

function printCommand(cmd){
  const line = document.createElement("div");
  line.innerHTML = `<span class="cyan">zeroorder</span>@Dellfedora:~$ ${escapeHtml(cmd)}`;
  output.appendChild(line);

  if(cmd.toLowerCase() === "clear"){
    output.innerHTML = "";
    return;
  }

  const result = responses[cmd.toLowerCase()];
  if(!result){
    const el = document.createElement("div");
    el.className = "muted";
    el.textContent = `command not found: ${cmd} — try 'help'`;
    output.appendChild(el);
  } else {
    result.forEach(text => {
      const el = document.createElement("div");
      el.className = "muted";
      el.textContent = text;
      output.appendChild(el);
    });
  }
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const cmd = input.value.trim();
  if(!cmd) return;
  printCommand(cmd);
  input.value = "";
});

document.querySelectorAll("[data-cmd]").forEach(btn => {
  btn.addEventListener("click", () => printCommand(btn.dataset.cmd));
});

document.getElementById("clearTerminal").addEventListener("click", () => {
  output.innerHTML = "";
});
