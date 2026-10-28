let books = [];
try { books = JSON.parse(localStorage.getItem("books")) || []; } catch (e) { books = []; }
let filter = "all";
const list = document.getElementById("list"), stats = document.getElementById("stats");

function save() { try { localStorage.setItem("books", JSON.stringify(books)); } catch (e) {} }

function render() {
  list.innerHTML = "";
  const shown = books.filter(b => filter === "all" || (filter === "read") === b.read);
  shown.forEach(b => {
    const li = document.createElement("li");
    if (b.read) li.className = "done";
    li.innerHTML = '<div class="info"><span class="name"></span><small></small></div>' +
      '<button class="toggle"></button><button class="del">Remove</button>';
    li.querySelector(".name").textContent = b.title;
    li.querySelector("small").textContent = "by " + b.author;
    li.querySelector(".toggle").textContent = b.read ? "Mark as to read" : "Mark as finished";
    li.querySelector(".toggle").onclick = () => { b.read = !b.read; save(); render(); };
    li.querySelector(".del").onclick = () => { books = books.filter(x => x.id !== b.id); save(); render(); };
    list.appendChild(li);
  });
  const done = books.filter(b => b.read).length;
  stats.textContent = books.length
    ? `${books.length} books, ${done} finished`
    : "Your list is empty. Add your first book above.";
}

document.getElementById("form").addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("title"), author = document.getElementById("author");
  books.push({ id: Date.now(), title: title.value.trim(), author: author.value.trim(), read: false });
  title.value = ""; author.value = "";
  save(); render();
});

document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    filter = btn.dataset.f;
    document.querySelectorAll(".filters button").forEach(x => x.classList.toggle("on", x === btn));
    render();
  };
});
render();
