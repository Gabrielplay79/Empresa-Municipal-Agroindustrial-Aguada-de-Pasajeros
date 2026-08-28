/* ============================================================
   APP: render de productos, servicios y combos, filtros,
   búsqueda, cinta marquee y animaciones al hacer scroll.
   (Este archivo no necesita editarse para el uso normal)
============================================================ */

/* ============ CINTA MARQUEE ============ */
const frasesCinta = [
  "Precios de origen", "Calidad garantizada", "Combos alimenticios",
  "Servicios técnicos", "Atención a cooperativas", "Producción local",
];
const espigaSVG = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M12 3v18M12 8l-5-3.5M12 8l5-3.5M12 14l-5-3.5M12 14l5-3.5"/></svg>';
const grupoHTML = `<div class="cinta-grupo">${frasesCinta.map(f => `<span>${f}</span>${espigaSVG}`).join("")}</div>`;
 $("#cintaPista").innerHTML = grupoHTML + grupoHTML;

/* ============ ESTADO DE FILTROS ============ */
const estadoFiltros = { cat: "todos", q: "" };

/* ============ PRODUCTOS ============ */
function productosFiltrados(){
  const q = estadoFiltros.q.trim().toLowerCase();
  return PRODUCTOS.filter(p =>
    (estadoFiltros.cat === "todos" || p.cat === estadoFiltros.cat) &&
    (q === "" || p.nombre.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  );
}

function renderProductos(){
  const lista = productosFiltrados();
  const grid = $("#gridProductos");
  const n = PRODUCTOS.filter(p => estadoFiltros.cat === "todos" || p.cat === estadoFiltros.cat).length;

  $("#contadorResultados").textContent = `${lista.length} de ${n} productos · precios en CUP`;

  if (lista.length === 0){
    grid.innerHTML = `
      <div class="sin-resultados">
        <i data-lucide="sprout"></i>
        No encontramos ese producto.<br>Pruebe con otro término o categoría.
      </div>`;
    lucide.createIcons();
    return;
  }

  grid.innerHTML = lista.map((p, i) => `
    <article class="card ${p.destacada ? "destacada" : ""}" style="animation-delay:${i * 55}ms">
      <div class="card-img">
        <img src="https://picsum.photos/seed/${p.seed}/720/460.jpg" alt="${p.nombre}" loading="lazy">
        ${p.etiqueta ? `<span class="etiqueta ${p.tipo === "oliva" ? "oliva" : ""}">${p.etiqueta}</span>` : ""}
      </div>
      <div class="card-cuerpo">
        <p class="card-categoria">${CATEGORIAS[p.cat]}</p>
        <h3 class="card-nombre">${p.nombre}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-pie">
          <p class="precio">${fmt(p.precio)}<small>por ${p.unidad}</small></p>
          <button class="btn-agregar" data-clave="p${p.id}" aria-label="Agregar ${p.nombre} al pedido">
            <i data-lucide="plus"></i> Agregar
          </button>
        </div>
      </div>
    </article>`).join("");
  lucide.createIcons();
}

/* Filtros y búsqueda */
 $("#filtros").addEventListener("click", e => {
  const btn = e.target.closest(".filtro");
  if (!btn) return;
  document.querySelectorAll(".filtro").forEach(b => b.classList.remove("activo"));
  btn.classList.add("activo");
  estadoFiltros.cat = btn.dataset.cat;
  renderProductos();
});
 $("#buscador").addEventListener("input", e => {
  estadoFiltros.q = e.target.value;
  renderProductos();
});

/* ============ SERVICIOS ============ */
function renderServicios(){
  $("#gridServicios").innerHTML = SERVICIOS.map((s, i) => `
    <article class="servicio-card" style="animation-delay:${i * 60}ms">
      <span class="servicio-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="servicio-icono"><i data-lucide="${s.icono}"></i></span>
      <h3 class="servicio-nombre">${s.nombre}</h3>
      <p class="servicio-desc">${s.descripcion}</p>
      ${s.puntos && s.puntos.length ? `
        <ul class="servicio-puntos">
          ${s.puntos.map(pt => `<li><i data-lucide="check"></i>${pt}</li>`).join("")}
        </ul>` : ""}
      <div class="servicio-pie">
        ${s.precio != null ? `<span class="precio">${fmt(s.precio)}</span>` : ""}
        ${s.enlace
          ? `<a class="btn-servicio" href="${s.enlace}">Ver opciones <i data-lucide="arrow-down"></i></a>`
          : `<button class="btn-servicio btn-solicitar" data-servicio="${s.nombre}">Solicitar <i data-lucide="arrow-right"></i></button>`}
      </div>
    </article>`).join("");
  lucide.createIcons();
}

 $("#gridServicios").addEventListener("click", e => {
  const btn = e.target.closest(".btn-solicitar");
  if (!btn) return;
  document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
  toast(`Llámenos o visítenos para coordinar: ${btn.dataset.servicio}`);
});

/* ============ COMBOS ============ */
function renderCombos(){
  $("#gridCombos").innerHTML = COMBOS.map((c, i) => `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="card-img">
        <img src="https://picsum.photos/seed/${c.seed}/720/460.jpg" alt="${c.nombre}" loading="lazy">
        ${c.etiqueta ? `<span class="etiqueta">${c.etiqueta}</span>` : ""}
      </div>
      <div class="card-cuerpo">
        <p class="card-categoria">Combo alimenticio</p>
        <h3 class="card-nombre">${c.nombre}</h3>
        <ul class="combo-elementos">
          ${c.elementos && c.elementos.length
            ? c.elementos.map(el => `<li><i data-lucide="plus"></i>${el}</li>`).join("")
            : `<li class="combo-vacio">Contáctenos para conocer los elementos incluidos</li>`}
        </ul>
        <div class="card-pie">
          <p class="precio">${fmt(c.precio)}<small>por combo</small></p>
          <button class="btn-agregar" data-clave="c${c.id}" aria-label="Agregar ${c.nombre} al pedido">
            <i data-lucide="plus"></i> Agregar
          </button>
        </div>
      </div>
    </article>`).join("");
  lucide.createIcons();
}

/* ============ AGREGAR AL PEDIDO (productos y combos) ============ */
["#gridProductos", "#gridCombos"].forEach(sel => {
  document.querySelector(sel).addEventListener("click", e => {
    const btn = e.target.closest(".btn-agregar");
    if (btn) agregarAlCarrito(btn.dataset.clave, btn);
  });
});

/* ============ REVEAL ON SCROLL ============ */
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting){
      e.target.classList.add("visible");
      observador.unobserve(e.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll("[data-reveal]").forEach(el => observador.observe(el));

/* ============ INICIO ============ */
renderProductos();
renderServicios();
renderCombos();
lucide.createIcons();