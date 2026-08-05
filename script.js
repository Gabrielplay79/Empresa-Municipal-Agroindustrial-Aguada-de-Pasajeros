let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = carrito.reduce((sum, item) => sum + item.precio, 0);

function renderCarrito() {
  const lista = document.getElementById("lista-carrito");
  lista.innerHTML = "";
  carrito.forEach((item, index) => {
    lista.innerHTML += `<li>${item.nombre} - ${item.precio} CUP 
      <button onclick="quitar(${index})">Quitar</button></li>`;
  });
  document.getElementById("total").textContent = total;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarProducto(elemento) {
  const nombre = elemento.querySelector("p").textContent.split("-")[0].trim();
  const precio = parseInt(elemento.dataset.precio);
  carrito.push({nombre, precio});
  total += precio;
  renderCarrito();
}

function quitar(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);
  renderCarrito();
}

// Inicializar botones
document.querySelectorAll(".agregar").forEach(boton => {
  boton.addEventListener("click", () => {
    agregarProducto(boton.parentElement);
  });
});

// Render inicial
renderCarrito();
