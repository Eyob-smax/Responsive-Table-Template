const darkToggler = document.getElementById("theme-toggle");

darkToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("dark", document.body.classList.contains("dark-mode"));
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark-mode");
  }
});
