/* ============================================================
   CARRITO / PEDIDO / PAGOS / TOASTS
   (Este archivo no necesita editarse para el uso normal)
============================================================ */

/* --- Datos de pago (también están en el HTML de contacto) --- */
const TARJETAS = [
  { moneda: "CUP", numero: "1245-4210-9542-0014" },
  { moneda: "USD", numero: "1245-4070-7542-0035" },
];

/* ============ HELPERS ============ */
const $ = s => document.querySelector(s);

/* Formato de precios en moneda nacional */
const fmt = n => "$" + n.toLocaleString("es-CU", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/* Busca un producto o combo a partir de su clave de carrito:
   "p3" → producto con id 3   |   "c2" → combo con id 2 */
function buscarItem(clave){
  const tipo = clave[0];
  const id = Number(clave.slice(1));
  if (tipo === "p"){
    const p = PRODUCTOS.find(x => x.id === id);
    return p ? { ...p } : null;
  }
  const c = COMBOS.find(x => x.id === id);
  return c ? { ...c, unidad: "combo" } : null;
}

const nombreItem = clave => (buscarItem(clave) || {}).nombre || "Producto";

/* ============ ESTADO ============ */
const estado = { carrito: new Map() };   // clave ("p1","c2") → cantidad

/* ============ TOASTS ============ */
function toast(mensaje){
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<i data-lucide="check-circle-2"></i> ${mensaje}`;
  $("#toasts").appendChild(el);
  lucide.createIcons();
  setTimeout(() => el.remove(), 2800);
}

/* ============ COPIAR AL PORTAPAPELES ============ */
function copiarFallback(texto){
  const ta = document.createElement("textarea");
  ta.value = texto;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch(e){}
  ta.remove();
}
function copiarTexto(texto, etiqueta){
  const aviso = () => toast(`${etiqueta} copiado al portapapeles`);
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(texto).then(aviso).catch(() => { copiarFallback(texto); aviso(); });
  } else {
    copiarFallback(texto);
    aviso();
  }
}
/* Delegación: funciona para los botones del HTML y de la confirmación */
document.addEventListener("click", e => {
  const btn = e.target.closest(".btn-copiar");
  if (!btn) return;
  copiarTexto(btn.dataset.numero, "Número de tarjeta");
});

/* ============ ABRIR / CERRAR DRAWER ============ */
let vistaDrawer = "carrito";   // carrito | formulario | confirmacion

function abrirDrawer(){
  $("#drawer").classList.add("abierto");
  $("#velo").classList.add("activo");
  document.body.style.overflow = "hidden";
  renderDrawer();
}
function cerrarDrawer(){
  $("#drawer").classList.remove("abierto");
  $("#velo").classList.remove("activo");
  document.body.style.overflow = "";
  if (vistaDrawer === "confirmacion"){
    estado.carrito.clear();
    actualizarConteo(false);
    vistaDrawer = "carrito";
  }
}
 $("#abrirCarrito").addEventListener("click", abrirDrawer);
 $("#cerrarCarrito").addEventListener("click", cerrarDrawer);
 $("#velo").addEventListener("click", cerrarDrawer);
document.addEventListener("keydown", e => { if (e.key === "Escape") cerrarDrawer(); });

/* ============ LÓGICA DEL CARRITO ============ */
function actualizarConteo(pop){
  let total = 0;
  estado.carrito.forEach(cant => total += cant);
  const el = $("#conteoCarrito");
  el.textContent = total;
  if (pop){ el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
}

function totalPedido(){
  let t = 0;
  estado.carrito.forEach((cant, clave) => {
    const item = buscarItem(clave);
    if (item) t += item.precio * cant;
  });
  return t;
}

/* Agrega al pedido, con feedback visual en el botón y toast */
function agregarAlCarrito(clave, btn){
  estado.carrito.set(clave, (estado.carrito.get(clave) || 0) + 1);
  actualizarConteo(true);

  if (btn){
    btn.classList.add("ok");
    btn.innerHTML = '<i data-lucide="check"></i> Agregado';
    lucide.createIcons();
    setTimeout(() => {
      btn.classList.remove("ok");
      btn.innerHTML = '<i data-lucide="plus"></i> Agregar';
      lucide.createIcons();
    }, 1200);
  }
  toast(`${nombreItem(clave)} agregado al pedido`);
}

/* ============ RENDER DEL DRAWER ============ */
function renderDrawer(){
  const cuerpo = $("#drawerCuerpo"), pie = $("#drawerPie"), titulo = $("#drawerTitulo");

  /* --- Vista: confirmación con datos de pago --- */
  if (vistaDrawer === "confirmacion"){
    titulo.textContent = "Pedido registrado";
    const codigo = "EMAP-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const total = totalPedido();
    let items = 0;
    estado.carrito.forEach(c => items += c);
    cuerpo.innerHTML = `
      <div class="confirmacion">
        <div class="check-circulo"><i data-lucide="check"></i></div>
        <h4>¡Pedido registrado!</h4>
        <p>Un especialista le contactará para coordinar la entrega.</p>
        <span class="orden-codigo">${codigo}</span>
        <p><strong>${items} ${items === 1 ? "artículo" : "artículos"}</strong> · Total estimado ${fmt(total)}</p>
        <p class="confirmacion-sub">Realice la transferencia a una de nuestras tarjetas</p>
        ${TARJETAS.map(t => `
          <div class="tarjeta-banco">
            <span class="tarjeta-moneda">${t.moneda}</span>
            <span class="tarjeta-num">${t.numero}</span>
            <button class="btn-copiar" data-numero="${t.numero}" aria-label="Copiar tarjeta ${t.moneda}"><i data-lucide="copy"></i></button>
          </div>`).join("")}
      </div>`;
    pie.innerHTML = `<button class="btn btn-primario btn-bloque" id="volverTienda">Seguir comprando</button>`;
    lucide.createIcons();
    $("#volverTienda").addEventListener("click", () => cerrarDrawer());
    return;
  }

  /* --- Vista: formulario de datos --- */
  if (vistaDrawer === "formulario"){
    titulo.textContent = "Datos de entrega";
    cuerpo.innerHTML = `
      <form id="formPedido" novalidate>
        <div class="campo" data-campo="nombre">
          <label for="fNombre">Nombre o entidad *</label>
          <input id="fNombre" type="text" placeholder="Ej. CCPF La Yagua">
          <span class="msg-error">Ingrese su nombre o el de su entidad.</span>
        </div>
        <div class="campo" data-campo="telefono">
          <label for="fTelefono">Teléfono de contacto *</label>
          <input id="fTelefono" type="tel" placeholder="Ej. 52098083">
          <span class="msg-error">Ingrese un teléfono válido (mín. 6 dígitos).</span>
        </div>
        <div class="campo">
          <label for="fDireccion">Dirección de entrega</label>
          <input id="fDireccion" type="text" placeholder="Calle, número, consejo popular">
        </div>
        <div class="campo">
          <label for="fNota">Nota para el pedido</label>
          <textarea id="fNota" rows="3" placeholder="Indicaciones especiales, horario preferido…"></textarea>
        </div>
      </form>`;
    pie.innerHTML = `
      <div class="total-linea"><span>Total</span><strong>${fmt(totalPedido())}</strong></div>
      <button class="btn btn-primario btn-bloque" id="confirmarPedido">
        Confirmar pedido <i data-lucide="arrow-right"></i>
      </button>
      <button class="btn btn-fantasma btn-bloque" id="volverCarrito" style="margin-top:.6rem">Volver al pedido</button>`;
    lucide.createIcons();

    $("#volverCarrito").addEventListener("click", () => { vistaDrawer = "carrito"; renderDrawer(); });
    $("#confirmarPedido").addEventListener("click", () => {
      let valido = true;
      const nombre = $("#fNombre").value.trim();
      const tel = $("#fTelefono").value.trim();
      const campoNombre = document.querySelector('[data-campo="nombre"]');
      const campoTel = document.querySelector('[data-campo="telefono"]');
      campoNombre.classList.toggle("error", !nombre);
      if (!nombre) valido = false;
      const telOk = tel.replace(/\D/g, "").length >= 6;
      campoTel.classList.toggle("error", !telOk);
      if (!telOk) valido = false;
      if (!valido) return;
      vistaDrawer = "confirmacion";
      renderDrawer();
    });
    return;
  }

  /* --- Vista: carrito normal --- */
  titulo.textContent = "Mi pedido";
  if (estado.carrito.size === 0){
    cuerpo.innerHTML = `
      <div class="carrito-vacio">
        <i data-lucide="shopping-basket"></i>
        <p>Tu pedido está vacío.<br>Explore el catálogo y los combos, y agregue lo que necesite.</p>
        <button class="btn btn-fantasma" id="irCatalogo">Explorar catálogo</button>
      </div>`;
    pie.innerHTML = "";
    lucide.createIcons();
    $("#irCatalogo").addEventListener("click", () => {
      cerrarDrawer();
      document.getElementById("productos").scrollIntoView({ behavior: "smooth" });
    });
    return;
  }

  cuerpo.innerHTML = [...estado.carrito.entries()].map(([clave, cant]) => {
    const item = buscarItem(clave);
    return `
    <div class="item">
      <img src="https://picsum.photos/seed/${item.seed}/160/160.jpg" alt="${item.nombre}">
      <div class="item-info">
        <p class="item-nombre">${item.nombre}</p>
        <p class="item-precio">${fmt(item.precio)} / ${item.unidad}</p>
        <div class="item-controles">
          <button class="btn-cant" data-accion="menos" data-id="${clave}" aria-label="Quitar uno"><i data-lucide="minus"></i></button>
          <span class="item-cant">${cant}</span>
          <button class="btn-cant" data-accion="mas" data-id="${clave}" aria-label="Agregar uno"><i data-lucide="plus"></i></button>
        </div>
      </div>
      <div style="display:grid;gap:.3rem;justify-items:end">
        <button class="btn-eliminar" data-accion="eliminar" data-id="${clave}" aria-label="Eliminar ${item.nombre}"><i data-lucide="trash-2"></i></button>
        <span class="item-sub">${fmt(item.precio * cant)}</span>
      </div>
    </div>`;
  }).join("");

  pie.innerHTML = `
    <div class="total-linea"><span>Total estimado</span><strong>${fmt(totalPedido())}</strong></div>
    <button class="btn btn-primario btn-bloque" id="realizarPedido">
      Realizar pedido <i data-lucide="arrow-right"></i>
    </button>`;
  lucide.createIcons();

  $("#realizarPedido").addEventListener("click", () => { vistaDrawer = "formulario"; renderDrawer(); });
}

/* Botones + / − / eliminar dentro del drawer */
 $("#drawerCuerpo").addEventListener("click", e => {
  const btn = e.target.closest("[data-accion]");
  if (!btn) return;
  const clave = btn.dataset.id;
  const accion = btn.dataset.accion;
  const actual = estado.carrito.get(clave) || 0;

  if (accion === "mas") estado.carrito.set(clave, actual + 1);
  if (accion === "menos"){
    if (actual <= 1) estado.carrito.delete(clave);
    else estado.carrito.set(clave, actual - 1);
  }
  if (accion === "eliminar"){
    estado.carrito.delete(clave);
    toast(`${nombreItem(clave)} eliminado del pedido`);
  }
  actualizarConteo(false);
  renderDrawer();
});