/* =====================================================
   DONUTS - script.js
   Todo lo editable está en la sección CONFIGURACIÓN y
   en las listas de productos (donas, smoothies, promos).
   ===================================================== */

/* ===== 1. CONFIGURACIÓN (cambia estos datos) ===== */
const CONFIG = {
  // EDITABLE: número de WhatsApp con código de país y sin símbolos. Este es solo un EJEMPLO.
  whatsapp: "50400000000",
  telefono: "[Teléfono editable]",
  correo: "[correo-ejemplo@donuts.com]",
  direccion: "[Dirección del local editable]",
  horario: "Lunes a sábado, 9:00 a.m. - 6:00 p.m. (ejemplo)"
};

// Imágenes: están en la carpeta images/ (donas, smoothies, promos, galeria, hero).
// Para usar fotos reales, guarda tu archivo (ej. images/donas/d1.jpg) y cambia la ruta en "img".
// Si una imagen no carga, se muestra una imagen de reemplazo.

/* ===== 2. PRODUCTOS (nombre, descripción, imagen y precio editables) ===== */
const donas = [
  { id: "d1", nombre: "Dona clásica glaseada", desc: "Suave, esponjosa y con glaseado dulce.", precio: 25, img: "images/donas/d1.svg", tag: "Popular" },
  { id: "d2", nombre: "Dona de chocolate", desc: "Cubierta de chocolate cremoso.", precio: 30, img: "images/donas/d2.svg" },
  { id: "d3", nombre: "Dona con chispas de colores", desc: "Glaseado rosa y chispas divertidas.", precio: 30, img: "images/donas/d3.svg", tag: "Popular" },
  { id: "d4", nombre: "Dona rellena de crema", desc: "Rellena de crema pastelera suave.", precio: 35, img: "images/donas/d4.svg" },
  { id: "d5", nombre: "Dona rellena de fresa", desc: "Relleno de mermelada de fresa.", precio: 35, img: "images/donas/d5.svg" },
  { id: "d6", nombre: "Dona de Oreo", desc: "Con trozos de galleta Oreo.", precio: 40, img: "images/donas/d6.svg", tag: "Destacada" },
  { id: "d7", nombre: "Dona de chocolate blanco", desc: "Cobertura de chocolate blanco.", precio: 35, img: "images/donas/d7.svg" },
  { id: "d8", nombre: "Dona especial de la casa", desc: "Nuestra receta secreta, ¡pruébala!", precio: 45, img: "images/donas/d8.svg", tag: "Destacada" }
];

const smoothies = [
  { id: "s1", nombre: "Smoothie de fresa", desc: "Fresa, leche y hielo.", precio: 50, img: "images/smoothies/s1.svg", tag: "Popular" },
  { id: "s2", nombre: "Smoothie de mango", desc: "Mango maduro, yogur y hielo.", precio: 50, img: "images/smoothies/s2.svg" },
  { id: "s3", nombre: "Smoothie de banano", desc: "Banano, leche y un toque de miel.", precio: 45, img: "images/smoothies/s3.svg" },
  { id: "s4", nombre: "Smoothie de piña", desc: "Piña fresca, hielo y limón.", precio: 50, img: "images/smoothies/s4.svg" },
  { id: "s5", nombre: "Smoothie de frutos rojos", desc: "Fresa, mora y arándano.", precio: 60, img: "images/smoothies/s5.svg", tag: "Destacado" },
  { id: "s6", nombre: "Smoothie de chocolate", desc: "Chocolate, leche y hielo.", precio: 55, img: "images/smoothies/s6.svg" },
  { id: "s7", nombre: "Smoothie de Oreo", desc: "Galleta Oreo, leche y crema.", precio: 60, img: "images/smoothies/s7.svg", tag: "Popular" },
  { id: "s8", nombre: "Smoothie tropical", desc: "Mango, piña y banano.", precio: 60, img: "images/smoothies/s8.svg" }
];

// Promociones: "normal" es el precio sin descuento (para calcular el ahorro)
const promos = [
  { id: "p1", nombre: "Combo dulce", desc: "2 donas clásicas + 1 smoothie de fresa.", precio: 95, normal: 100, img: "images/promos/p1.svg" },
  { id: "p2", nombre: "Combo para compartir", desc: "4 donas variadas + 2 smoothies.", precio: 210, normal: 235, img: "images/promos/p2.svg" },
  { id: "p3", nombre: "Combo especial", desc: "6 donas surtidas a precio promocional.", precio: 175, normal: 195, img: "images/promos/p3.svg" }
];

// Un solo mapa con todos los productos para buscarlos por id
const catalogo = {};
[...donas, ...smoothies, ...promos].forEach(p => catalogo[p.id] = p);

/* ===== 3. UTILIDADES ===== */
const $ = (id) => document.getElementById(id);
const dinero = (n) => "L " + n;
// Imagen de reemplazo: cambia de color y emoji según el nombre del producto
function imagenRespaldo(alt) {
  const colores = ["#ffd6e8", "#ffe3c2", "#f3d9c9", "#fde1f0", "#ffeccc", "#e8d3ff"];
  let n = 0;
  for (const letra of alt) n += letra.charCodeAt(0);
  const emoji = /smoothie|combo|frutos|tropical/i.test(alt) ? "🥤" : "🍩";
  return "data:image/svg+xml;utf8," + encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450'><rect width='100%' height='100%' fill='${colores[n % colores.length]}'/><text x='50%' y='50%' font-size='110' text-anchor='middle'>${emoji}</text><text x='50%' y='85%' font-size='28' text-anchor='middle' fill='#4a2c2a' font-family='Arial'>${alt}</text></svg>`);
}

// Si una imagen falla, se pone la imagen de reemplazo (una sola vez)
document.addEventListener("error", (e) => {
  const img = e.target;
  if (img.tagName === "IMG" && !img.dataset.respaldo && !img.src.includes("logo-donuts")) {
    img.dataset.respaldo = "1";
    img.src = imagenRespaldo(img.alt || "Donuts");
  }
}, true);

function mostrarAviso(texto) {
  const t = $("toast");
  t.textContent = texto;
  t.classList.add("visible");
  clearTimeout(mostrarAviso.temporizador);
  mostrarAviso.temporizador = setTimeout(() => t.classList.remove("visible"), 2000);
}

/* ===== 4. DIBUJAR TARJETAS ===== */
function tarjetaProducto(p) {
  const ahorro = p.normal ? p.normal - p.precio : 0;
  const etiqueta = p.normal ? "Oferta especial" : p.tag;
  return `
    <article class="tarjeta producto" data-nombre="${p.nombre.toLowerCase()} ${p.desc.toLowerCase()}">
      ${etiqueta ? `<span class="etiqueta">${etiqueta}</span>` : ""}
      <img class="producto__img" src="${p.img}" alt="${p.nombre}" loading="lazy">
      <div class="producto__cuerpo">
        <h3>${p.nombre}</h3>
        <p class="producto__desc">${p.desc}</p>
        ${p.normal ? `<span class="tachado">Normal: ${dinero(p.normal)}</span>` : ""}
        <span class="producto__precio">${dinero(p.precio)}</span>
        ${ahorro ? `<span class="ahorro">¡Ahorras ${dinero(ahorro)}!</span>` : ""}
        <button class="btn-agregar" data-id="${p.id}">Agregar al carrito</button>
      </div>
    </article>`;
}

function dibujarCatalogo() {
  $("gridDonas").innerHTML = donas.map(tarjetaProducto).join("");
  $("gridSmoothies").innerHTML = smoothies.map(tarjetaProducto).join("");
  $("gridPromos").innerHTML = promos.map(tarjetaProducto).join("");
  // Galería con las mismas fotos
  const fotos = ["g1","g2","g3","g4","g5","g6","g7","g8"].map(n => `images/galeria/${n}.svg`);
  const textos = ["Donas decoradas con glaseados de colores", "Caja de seis donas variadas", "Donas rellenas de crema y de fresa", "Donas con diferentes glaseados", "Smoothies de mango, frutos rojos y piña", "Combo de dona con chispas y smoothie de fresa", "Smoothies de Oreo y tropical con donas", "Donas variadas en forma de corazón"];
  $("galeria").innerHTML = fotos.map((f, i) => `<img src="${f}" alt="${textos[i]}" loading="lazy">`).join("");
  // Hero: fotos
  document.querySelectorAll("[data-foto]").forEach(img => img.src = img.dataset.foto === "dona" ? "images/hero/hero-dona.svg" : "images/hero/hero-smoothie.svg");
}

/* ===== 5. FILTRO Y BUSCADOR ===== */
let filtroActual = "todos";
function aplicarFiltros() {
  const texto = $("buscador").value.trim().toLowerCase();
  let visibles = 0;
  document.querySelectorAll("#bloqueDonas .producto, #bloqueSmoothies .producto").forEach(card => {
    const coincide = card.dataset.nombre.includes(texto);
    card.hidden = !coincide;
    if (coincide) visibles++;
  });
  $("bloqueDonas").hidden = filtroActual === "smoothie" || !$("gridDonas").querySelector(".producto:not([hidden])");
  $("bloqueSmoothies").hidden = filtroActual === "dona" || !$("gridSmoothies").querySelector(".producto:not([hidden])");
  const hayDonas = filtroActual !== "smoothie" && !$("bloqueDonas").hidden;
  const haySmoothies = filtroActual !== "dona" && !$("bloqueSmoothies").hidden;
  $("sinResultados").hidden = hayDonas || haySmoothies;
}

/* ===== 6. CARRITO (se guarda en localStorage) ===== */
let carrito = {};
try { carrito = JSON.parse(localStorage.getItem("carritoDonuts")) || {}; } catch (e) { carrito = {}; }
// Quitar productos que ya no existan en el catálogo
Object.keys(carrito).forEach(id => { if (!catalogo[id]) delete carrito[id]; });

function guardarCarrito() {
  try { localStorage.setItem("carritoDonuts", JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
}
const totalUnidades = () => Object.values(carrito).reduce((a, b) => a + b, 0);
const totalDinero = () => Object.entries(carrito).reduce((suma, [id, c]) => suma + catalogo[id].precio * c, 0);

function agregar(id) {
  carrito[id] = (carrito[id] || 0) + 1;
  actualizarCarrito();
  mostrarAviso("✅ " + catalogo[id].nombre + " agregado");
}
function cambiarCantidad(id, cambio) {
  carrito[id] += cambio;
  if (carrito[id] <= 0) delete carrito[id];
  actualizarCarrito();
}
function eliminar(id) { delete carrito[id]; actualizarCarrito(); }
function vaciar() { carrito = {}; actualizarCarrito(); }

function actualizarCarrito() {
  const ids = Object.keys(carrito);
  $("listaCarrito").innerHTML = ids.length === 0
    ? "<p class='aviso'>Tu carrito está vacío. ¡Agrega algo dulce! 🍩</p>"
    : ids.map(id => `
      <div class="item">
        <strong>${catalogo[id].nombre}</strong>
        <div>${dinero(catalogo[id].precio)} c/u · Subtotal: <strong>${dinero(catalogo[id].precio * carrito[id])}</strong></div>
        <div class="item__fila">
          <button data-accion="menos" data-id="${id}" aria-label="Disminuir cantidad">−</button>
          <span>${carrito[id]}</span>
          <button data-accion="mas" data-id="${id}" aria-label="Aumentar cantidad">+</button>
          <button class="quitar" data-accion="quitar" data-id="${id}">Eliminar</button>
        </div>
      </div>`).join("");
  $("contadorCarrito").textContent = totalUnidades();
  $("totalUnidades").textContent = totalUnidades();
  $("totalCarrito").textContent = dinero(totalDinero());
  $("productosSel").value = ids.map(id => `${carrito[id]} x ${catalogo[id].nombre} (${dinero(catalogo[id].precio * carrito[id])})`).join("\n");
  guardarCarrito();
}

function abrirCarrito(abrir) {
  $("carrito").classList.toggle("abierto", abrir);
  $("carrito").setAttribute("aria-hidden", !abrir);
  $("overlay").hidden = !abrir;
}

/* ===== 7. FORMULARIO Y WHATSAPP ===== */
function validar() {
  let ok = true;
  const poner = (id, msg) => { $(id).textContent = msg; if (msg) ok = false; };
  poner("errNombre", $("nombre").value.trim().length < 3 ? "Escribe tu nombre (mínimo 3 letras)." : "");
  poner("errTelefono", /^[0-9+\s-]{8,15}$/.test($("telefono").value.trim()) ? "" : "Escribe un teléfono válido (8 a 15 dígitos).");
  const domicilio = $("entrega").value === "Entrega a domicilio";
  poner("errDireccion", domicilio && $("direccion").value.trim().length < 5 ? "Escribe la dirección de entrega." : "");
  poner("errProductos", totalUnidades() === 0 ? "Agrega al menos un producto al carrito." : "");
  return ok;
}

function textoPedido() {
  const lineas = Object.keys(carrito).map(id => `• ${carrito[id]} x ${catalogo[id].nombre} - ${dinero(catalogo[id].precio * carrito[id])}`);
  let t = `Hola Donuts, soy ${$("nombre").value.trim()}. Quiero hacer este pedido:\n${lineas.join("\n")}\n\nTotal: ${dinero(totalDinero())}\nEntrega: ${$("entrega").value}`;
  if ($("entrega").value === "Entrega a domicilio") t += `\nDirección: ${$("direccion").value.trim()}`;
  t += `\nPago: ${$("pago").value}\nTeléfono: ${$("telefono").value.trim()}`;
  if ($("notas").value.trim()) t += `\nIndicaciones: ${$("notas").value.trim()}`;
  return t;
}

const enlaceWhatsapp = (texto = "") => `https://wa.me/${CONFIG.whatsapp}${texto ? "?text=" + encodeURIComponent(texto) : ""}`;

function mostrarResumen() {
  const items = Object.keys(carrito).map(id => `<li>${carrito[id]} x ${catalogo[id].nombre} — ${dinero(catalogo[id].precio * carrito[id])}</li>`).join("");
  $("resumen").innerHTML = `
    <h3>Resumen del pedido</h3>
    <p><strong>${$("nombre").value.trim()}</strong> · ${$("entrega").value} · ${$("pago").value}</p>
    <ul>${items}</ul>
    <p class="carrito__total">Total: ${dinero(totalDinero())}</p>
    <a class="btn btn--primario" target="_blank" rel="noopener" href="${enlaceWhatsapp(textoPedido())}">Enviar pedido por WhatsApp</a>
    <p class="nota">El pedido no se guarda en ningún servidor: se envía desde tu WhatsApp al número configurado (actualmente un número de ejemplo).</p>`;
  $("resumen").scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ===== 8. EVENTOS ===== */
function iniciar() {
  dibujarCatalogo();
  // Datos de contacto
  document.querySelectorAll("[data-contacto]").forEach(el => {
    const clave = el.dataset.contacto;
    el.textContent = clave === "whatsapp" ? "+" + CONFIG.whatsapp + " (ejemplo)" : CONFIG[clave];
    if (clave === "whatsapp") el.href = enlaceWhatsapp();
  });
  $("btnWhatsapp").href = enlaceWhatsapp("Hola Donuts, quiero más información.");

  // Botones "Agregar" (de catálogo y promos) y controles del carrito
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("button, a");
    if (!btn) return;
    if (btn.classList.contains("btn-agregar")) agregar(btn.dataset.id);
    if (btn.dataset.accion === "mas") cambiarCantidad(btn.dataset.id, 1);
    if (btn.dataset.accion === "menos") cambiarCantidad(btn.dataset.id, -1);
    if (btn.dataset.accion === "quitar") eliminar(btn.dataset.id);
  });
  $("btnAbrirCarrito").addEventListener("click", () => abrirCarrito(true));
  $("btnCerrarCarrito").addEventListener("click", () => abrirCarrito(false));
  $("overlay").addEventListener("click", () => abrirCarrito(false));
  $("btnIrPedido").addEventListener("click", () => abrirCarrito(false));
  $("btnVaciar").addEventListener("click", vaciar);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") abrirCarrito(false); });

  // Menú móvil
  $("btnMenu").addEventListener("click", () => {
    const abierto = $("menu").classList.toggle("abierto");
    $("btnMenu").setAttribute("aria-expanded", abierto);
  });
  $("menu").addEventListener("click", () => { $("menu").classList.remove("abierto"); $("btnMenu").setAttribute("aria-expanded", false); });

  // Filtros y buscador
  $("buscador").addEventListener("input", aplicarFiltros);
  document.querySelectorAll(".filtro").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll(".filtro").forEach(x => x.classList.remove("activo"));
    b.classList.add("activo");
    filtroActual = b.dataset.filtro;
    aplicarFiltros();
  }));

  // Formulario
  $("entrega").addEventListener("change", () => { $("campoDireccion").hidden = $("entrega").value !== "Entrega a domicilio"; });
  $("formPedido").addEventListener("submit", (e) => {
    e.preventDefault();
    if (validar()) mostrarResumen(); else mostrarAviso("Revisa los campos marcados");
  });

  // Aparición suave de secciones (se respeta si el usuario reduce animaciones)
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observador = new IntersectionObserver((entradas) => entradas.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("visible-seccion"); observador.unobserve(en.target); }
    }), { threshold: 0.1 });
    document.querySelectorAll(".seccion").forEach(s => { s.classList.add("oculto"); observador.observe(s); });
  }

  actualizarCarrito();
}

document.addEventListener("DOMContentLoaded", iniciar);
