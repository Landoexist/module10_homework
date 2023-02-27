const btn = document.querySelector(".btn");

btn.addEventListener("click", () => {
  alert(
    `Ширина экрана: ${window.screen.width}\nВысота экрана: ${window.screen.height}`
  );
});
