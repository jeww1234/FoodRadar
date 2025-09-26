export default function toggleDialog() {
  const popup = document.getElementById("popup");
  const openBtn = document.getElementById("openBtn");
  const closeBtn = document.getElementById("closeBtn");

  openBtn.addEventListener("click", () => {
    popup.classList.add("show");
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.remove("show");
  });
}