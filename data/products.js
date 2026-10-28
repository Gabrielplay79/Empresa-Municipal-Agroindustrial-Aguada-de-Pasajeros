/* ==========================================================================
   products.js — Carga y render del catálogo
   --------------------------------------------------------------------------
   ESTRATEGIA DE CARGA (3 capas, fail-safe):
     1) Si existe window.PRODUCTS_DATA (cargada por data/products.js como
        <script> en el HTML), la usa directamente. Es el camino mas rapido
        y funciona en file://, http:// y https://.
     2) Si no, intenta descargar data/products.json con fetch().
        Funciona en GitHub Pages y en cualquier servidor HTTP.
     3) Si fetch() tambien falla, usa el catalogo EMBEBIDO en este archivo
        (CATALOG_EMBED, mas abajo). Garantia absoluta de que la tienda
        siempre muestre productos aunque el navegador bloquee fetch() Y
        data/products.js no se haya cargado.
     4) Solo si todo lo anterior falla, muestra el mensaje de error (#errorBox).

   MANTENIMIENTO: edita data/products.json y vuelve a ejecutar
   python scripts/sync_products_js.py (o pega el JSON nuevo en CATALOG_EMBED).
   ========================================================================== */

(function (global) {
  "use strict";

  var DATA_URL = "data/products.json";

  var categories = [];
  var products = [];

  /* ======================================================================
     CATALOGO EMBEDIDO — copia literal de data/products.json
     ======================================================================
     Ultima linea de defensa: si ni fetch() ni window.PRODUCTS_DATA estan
     disponibles, este literal garantiza que los productos se muestren.
     ====================================================================== */
  var CATALOG_EMBED = {
  "categories": [
    {
      "id": "carnicos",
      "name": "Productos Cárnicos",
      "order": 1,
      "description": "Oferta de productos cárnicos de la empresa. Precios en Moneda Nacional (CUP)."
    },
    {
      "id": "carnicos-mpa",
      "name": "Cárnicos — Materia Prima Adquirida",
      "order": 2,
      "description": "Productos cárnicos con materia prima adquirida o de sobrecumplimiento."
    },
    {
      "id": "lacteos-dulces",
      "name": "Lácteos, Dulces y Conservas",
      "order": 3,
      "description": "Producción de la mini industria láctea, dulces y conservas."
    },
    {
      "id": "lacteos-mpa",
      "name": "Lácteos — Materia Prima Adquirida",
      "order": 4,
      "description": "Productos de la mini industria láctea, dulces y conservas con materia prima adquirida o de sobrecumplimiento."
    },
    {
      "id": "agropecuarios",
      "name": "Productos Agropecuarios",
      "order": 5,
      "description": "Viandas, hortalizas, frutas, granos y otros. Oferta pendiente de concertación: los precios pueden variar."
    },
    {
      "id": "servicios",
      "name": "Servicios",
      "order": 6,
      "description": "Servicios de la empresa. No se añaden al carrito: debe coordinar horario y detalles con anticipación llamando a los números de contacto."
    }
  ],
  "products": [
    {
      "id": "carn-ternilla",
      "name": "Ternilla",
      "price": 200.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Carne de res joven en cortes listos para elaborar."
    },
    {
      "id": "carn-hueso-rojo",
      "name": "Hueso Rojo",
      "price": 200.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Hueso de res con médula roja, ideal para caldos y sopas."
    },
    {
      "id": "carn-hueso-blanco",
      "name": "Hueso Blanco",
      "price": 100.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Hueso de res para caldos, precio por kilogramo."
    },
    {
      "id": "carn-patas",
      "name": "Patas",
      "price": 15.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Patas de res, base para caldos y gelatinas naturales."
    },
    {
      "id": "carn-masa-hamburguesa",
      "name": "Masa de Hamburguesa",
      "price": 710.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Masa condimentada lista para formar hamburguesas."
    },
    {
      "id": "carn-masa-chorizo",
      "name": "Masa Chorizo",
      "price": 1000.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Masa de chorizo condimentada lista para embutir."
    },
    {
      "id": "carn-masa-jamon",
      "name": "Masa Jamón",
      "price": 1200.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Masa para la elaboración de jamón."
    },
    {
      "id": "carn-higado",
      "name": "Hígado",
      "price": 800.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Hígado de res fresco, rico en hierro."
    },
    {
      "id": "carn-mortadella",
      "name": "Mortadella",
      "price": 1200.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Embutido tipo mortadella, precio por kilogramo."
    },
    {
      "id": "carn-chorizo",
      "name": "Chorizo",
      "price": 1450.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Chorizo elaborado en la empresa."
    },
    {
      "id": "carn-corazon",
      "name": "Corazón",
      "price": 800.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Corazón de res fresco."
    },
    {
      "id": "carn-lengua",
      "name": "Lengua",
      "price": 800.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Lengua de res lista para cocinar."
    },
    {
      "id": "carn-jabon",
      "name": "Jabón de Lavar",
      "price": 100.0,
      "category": "carnicos",
      "unit": "U",
      "description": "Jabón de lavar producido por la empresa."
    },
    {
      "id": "carn-bofe",
      "name": "Bofe",
      "price": 25.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Bofe (pulmón) de res fresco."
    },
    {
      "id": "carn-pitrafa",
      "name": "Pitrafa",
      "price": 25.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Pitrafa de res fresca."
    },
    {
      "id": "carn-rinon",
      "name": "Riñón",
      "price": 50.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Riñón de res fresco."
    },
    {
      "id": "carn-rabo",
      "name": "Rabo Troceado",
      "price": 250.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Rabo de res troceado, ideal para sopas y guisos."
    },
    {
      "id": "carn-jamonada",
      "name": "Jamonada",
      "price": 1300.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Jamonada elaborada en la empresa."
    },
    {
      "id": "carn-panza",
      "name": "Panza",
      "price": 150.0,
      "category": "carnicos",
      "unit": "U",
      "description": "Panza de res, precio por unidad."
    },
    {
      "id": "carn-morcilla",
      "name": "Morcilla",
      "price": 950.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Morcilla elaborada en la empresa."
    },
    {
      "id": "carn-sangre",
      "name": "Sangre",
      "price": 50.0,
      "category": "carnicos",
      "unit": "LIT",
      "description": "Sangre de res, precio por litro."
    },
    {
      "id": "carn-sebo",
      "name": "Sebo",
      "price": 30.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Sebo de res."
    },
    {
      "id": "carn-cueros",
      "name": "Cueros",
      "price": 2000.0,
      "category": "carnicos",
      "unit": "U",
      "description": "Cueros de res, precio por unidad."
    },
    {
      "id": "carn-picadillo-especial",
      "name": "Picadillo Especial",
      "price": 1500.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Picadillo especial elaborado en la empresa."
    },
    {
      "id": "carn-salchichas",
      "name": "Salchichas",
      "price": 2500.0,
      "category": "carnicos",
      "unit": "KG",
      "description": "Salchichas elaboradas en la empresa."
    },
    {
      "id": "mpa-cortes-1",
      "name": "Cortes varios de Res Primera",
      "price": 2250.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Selección de cortes de res de primera calidad."
    },
    {
      "id": "mpa-picadillo-1",
      "name": "Picadillo de Res Primera",
      "price": 1500.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Picadillo de res de primera calidad."
    },
    {
      "id": "mpa-cortes-2",
      "name": "Cortes varios de Res Segunda",
      "price": 1830.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Cortes de res de segunda calidad."
    },
    {
      "id": "mpa-picadillo-2",
      "name": "Picadillo de Res Segunda",
      "price": 710.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Picadillo de res de segunda calidad."
    },
    {
      "id": "mpa-higado",
      "name": "Hígado de Res",
      "price": 800.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Hígado de res."
    },
    {
      "id": "mpa-rabo",
      "name": "Rabo Troceado Res",
      "price": 600.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Rabo de res troceado."
    },
    {
      "id": "mpa-lengua",
      "name": "Lengua Res",
      "price": 800.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Lengua de res."
    },
    {
      "id": "mpa-corazon",
      "name": "Corazón Res",
      "price": 800.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Corazón de res."
    },
    {
      "id": "mpa-pollo",
      "name": "Pollo",
      "price": 1800.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Pollo."
    },
    {
      "id": "mpa-conejo",
      "name": "Conejo Canal Calidad Única",
      "price": 2000.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Conejo canal calidad única."
    },
    {
      "id": "mpa-ovino",
      "name": "Ovino Canal Calidad Única",
      "price": 2500.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Ovino canal calidad única."
    },
    {
      "id": "mpa-banda",
      "name": "Carne de Res en Banda",
      "price": 2000.0,
      "category": "carnicos-mpa",
      "unit": "KG",
      "description": "Carne de res en banda."
    },
    {
      "id": "lact-yogurt",
      "name": "Yogurt Natural",
      "price": 350.0,
      "category": "lacteos-dulces",
      "unit": "LIT",
      "description": "Yogurt natural de la mini industria láctea."
    },
    {
      "id": "lact-vinagre",
      "name": "Vinagre",
      "price": 300.0,
      "category": "lacteos-dulces",
      "unit": "LIT",
      "description": "Vinagre producido en la empresa."
    },
    {
      "id": "lact-queso",
      "name": "Queso",
      "price": 390.0,
      "category": "lacteos-dulces",
      "unit": "LIB",
      "description": "Queso de la mini industria láctea."
    },
    {
      "id": "lact-mpa-yogurt",
      "name": "Yogurt Natural (M.P.A.)",
      "price": 420.0,
      "category": "lacteos-mpa",
      "unit": "LIT",
      "description": "Yogurt natural con materia prima adquirida o de sobrecumplimiento."
    },
    {
      "id": "lact-mpa-queso",
      "name": "Queso (M.P.A.)",
      "price": 400.0,
      "category": "lacteos-mpa",
      "unit": "LIB",
      "description": "Queso con materia prima adquirida o de sobrecumplimiento."
    },
    {
      "id": "agro-boniato",
      "name": "Boniato",
      "price": 180.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Boniato."
    },
    {
      "id": "agro-yuca",
      "name": "Yuca pelada congelada",
      "price": 200.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Yuca pelada y congelada."
    },
    {
      "id": "agro-calabaza",
      "name": "Calabaza beneficiada",
      "price": 160.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Calabaza beneficiada."
    },
    {
      "id": "agro-platano-manzano",
      "name": "Plátano fruta manzano",
      "price": 175.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Plátano fruta manzano desmanado y beneficiado."
    },
    {
      "id": "agro-platano-fruta",
      "name": "Plátano fruta",
      "price": 185.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Plátano fruta desmanado y beneficiado."
    },
    {
      "id": "agro-platano-burro",
      "name": "Plátano burro",
      "price": 145.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Plátano burro desmanado y beneficiado."
    },
    {
      "id": "agro-platano-vianda",
      "name": "Plátano vianda",
      "price": 200.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Plátano vianda desmanado y beneficiado."
    },
    {
      "id": "agro-malanga-colocasia",
      "name": "Malanga colocasia",
      "price": 175.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Malanga colocasia beneficiada."
    },
    {
      "id": "agro-malanga-xantosoma",
      "name": "Malanga xantosoma",
      "price": 185.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Malanga xantosoma beneficiada."
    },
    {
      "id": "agro-frijol-negro",
      "name": "Frijol negro",
      "price": 1050.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Frijol negro."
    },
    {
      "id": "agro-frijol-colorado",
      "name": "Frijol colorado",
      "price": 1150.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Frijol colorado."
    },
    {
      "id": "agro-frijol-blanco",
      "name": "Frijol blanco",
      "price": 1200.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Frijol blanco."
    },
    {
      "id": "agro-frutabomba",
      "name": "Fruta bomba madura",
      "price": 145.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Fruta bomba beneficiada madura."
    },
    {
      "id": "agro-guayaba",
      "name": "Guayaba beneficiada",
      "price": 155.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Guayaba beneficiada."
    },
    {
      "id": "agro-limon-1",
      "name": "Limón Primera",
      "price": 950.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Limón de primera calidad."
    },
    {
      "id": "agro-limon-2",
      "name": "Limón Segunda",
      "price": 900.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Limón de segunda calidad."
    },
    {
      "id": "agro-mango-1",
      "name": "Mango Primera",
      "price": 140.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Mango de primera calidad."
    },
    {
      "id": "agro-mango-2",
      "name": "Mango Segunda",
      "price": 120.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Mango de segunda calidad."
    },
    {
      "id": "agro-melon-1",
      "name": "Melón Primera",
      "price": 165.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Melón de primera calidad."
    },
    {
      "id": "agro-melon-2",
      "name": "Melón Segunda",
      "price": 150.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Melón de segunda calidad."
    },
    {
      "id": "agro-pina-1",
      "name": "Piña Primera",
      "price": 170.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Piña de primera calidad."
    },
    {
      "id": "agro-pina-2",
      "name": "Piña Segunda",
      "price": 155.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Piña de segunda calidad."
    },
    {
      "id": "agro-toronja-1",
      "name": "Toronja Primera",
      "price": 200.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Toronja de primera calidad."
    },
    {
      "id": "agro-toronja-2",
      "name": "Toronja Segunda",
      "price": 190.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Toronja de segunda calidad."
    },
    {
      "id": "agro-nispero-1",
      "name": "Níspero Primera",
      "price": 230.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Níspero de primera calidad."
    },
    {
      "id": "agro-nispero-2",
      "name": "Níspero Segunda",
      "price": 215.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Níspero de segunda calidad."
    },
    {
      "id": "agro-carbon-1",
      "name": "Carbón Marabú Primera",
      "price": 130.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Carbón Marabú clasificado calidad Primera."
    },
    {
      "id": "agro-carbon-2",
      "name": "Carbón Marabú Segunda",
      "price": 86.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Carbón Marabú clasificado calidad Segunda."
    },
    {
      "id": "agro-carbon-mezcla",
      "name": "Carbón mezcla Marabú",
      "price": 117.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Carbón mezcla clasificado de Marabú al 70% Primera + 30% Segunda."
    },
    {
      "id": "agro-carbon-dif",
      "name": "Carbón precio diferenciado",
      "price": 1600.0,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Carbón con precio diferenciado."
    },
    {
      "id": "agro-arroz",
      "name": "Arroz de Consumo",
      "price": 760.87,
      "category": "agropecuarios",
      "unit": "KG",
      "description": "Arroz de consumo nacional."
    },
    {
      "id": "serv-transporte",
      "name": "Transportación, Carga y Pasajeros",
      "type": "service",
      "category": "servicios",
      "description": "Servicio de transportación de carga y de pasajeros.",
      "contactText": "Para solicitar este servicio y coordinar el horario, llame o escriba a los números de contacto de la empresa. El horario se confirma de antemano."
    },
    {
      "id": "serv-pintura",
      "name": "Pintura y Carpintería",
      "type": "service",
      "category": "servicios",
      "description": "Servicios de pintura y carpintería.",
      "contactText": "Para solicitar este servicio y coordinar el horario, llame o escriba a los números de contacto de la empresa. El horario se confirma de antemano."
    },
    {
      "id": "serv-asesoria",
      "name": "Asesoría Técnica (Contabilidad)",
      "type": "service",
      "category": "servicios",
      "description": "Asesoría técnica en contabilidad.",
      "contactText": "Para solicitar este servicio y coordinar el horario, llame o escriba a los números de contacto de la empresa. El horario se confirma de antemano."
    },
    {
      "id": "serv-agricola",
      "name": "Servicio Agrícola",
      "type": "service",
      "category": "servicios",
      "description": "Servicios agrícolas.",
      "contactText": "Para solicitar este servicio y coordinar el horario, llame o escriba a los números de contacto de la empresa. El horario se confirma de antemano."
    }
  ],
  "serviceContact": {
    "fijos": [
      "43569143",
      "43569137"
    ],
    "moviles": [
      "+53 52098083",
      "+53 52117036"
    ],
    "note": "Importante: para más información de los servicios llame o escriba a los números de contacto. El horario de cada servicio se coordina de antemano."
  }
};

  /* ======================================================================
     CARGA DE DATOS
     ====================================================================== */
  function load() {
    // Capa 1: respaldo embebido en data/products.js (cargado como <script>)
    if (global.PRODUCTS_DATA) {
      try {
        initData(global.PRODUCTS_DATA);
        console.info("products.js: catalogo cargado desde window.PRODUCTS_DATA");
        return Promise.resolve();
      } catch (e) {
        console.warn("products.js: window.PRODUCTS_DATA invalido:", e);
      }
    }

    // Capa 2: fetch del JSON
    return fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) {
          throw new Error("HTTP " + res.status + " al cargar products.json");
        }
        return res.json();
      })
      .then(function (data) {
        console.info("products.js: catalogo cargado desde " + DATA_URL);
        initData(data);
      })
      .catch(function (err) {
        console.warn(
          "products.js: no se pudo leer " + DATA_URL + " (" + (err && err.message ? err.message : err) + "). " +
          "Usando catalogo embebido en este archivo..."
        );
        // Capa 3: catalogo embebido en este propio js/products.js
        try {
          initData(CATALOG_EMBED);
          console.info("products.js: catalogo cargado desde CATALOG_EMBED");
        } catch (e2) {
          console.error("products.js: catalogo embebido invalido:", e2);
          showError();
        }
      });
  }

  /** Valida, ordena y renderiza los datos del catalogo. */
  function initData(data) {
    if (!data || !Array.isArray(data.categories) || !Array.isArray(data.products)) {
      throw new Error("Estructura de datos invalida");
    }
    categories = data.categories.slice().sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
    products = data.products.slice();
    renderNav();
    renderCatalog();
  }

  /* ======================================================================
     RENDER: NAVEGACION DE CATEGORIAS
     ====================================================================== */
  function renderNav() {
    var nav = document.getElementById("navCategories");
    if (!nav) return;
    nav.innerHTML = "";
    categories.forEach(function (cat) {
      var a = document.createElement("a");
      a.href = "#cat-" + cat.id;
      a.textContent = cat.name;
      nav.appendChild(a);
    });
  }

  /* ======================================================================
     RENDER: CATALOGO PRINCIPAL
     ====================================================================== */
  function renderCatalog() {
    var catalog = document.getElementById("catalog");
    if (!catalog) return;
    catalog.innerHTML = ""; // limpia el "Cargando..."

    categories.forEach(function (cat) {
      var prodsInCat = products.filter(function (p) { return p.category === cat.id; });
      if (prodsInCat.length === 0) return; // no muestra categorias vacias

      var section = document.createElement("section");
      section.className = "category-section";
      section.id = "cat-" + cat.id;

      var title = document.createElement("h2");
      title.className = "category-title";
      title.textContent = cat.name;
      section.appendChild(title);

      // Descripcion opcional de la categoria (campo "description" del JSON)
      if (cat.description) {
        var desc = document.createElement("p");
        desc.className = "category-desc";
        desc.textContent = cat.description;
        section.appendChild(desc);
      }

      var grid = document.createElement("div");
      grid.className = "product-grid";

      prodsInCat.forEach(function (p) {
        grid.appendChild(buildProductCard(p));
      });

      section.appendChild(grid);
      catalog.appendChild(section);
    });
  }

  /* ======================================================================
     CONSTRUYE UNA TARJETA DE PRODUCTO
     ====================================================================== */
  function buildProductCard(product) {
    var isService = product.type === "service";
    var card = document.createElement("article");
    card.className = isService ? "product-card service-card" : "product-card";

    var name = document.createElement("h3");
    name.className = "product-name";
    name.textContent = product.name;

    var desc = document.createElement("p");
    desc.className = "product-desc";
    desc.textContent = product.description || "";

    card.appendChild(name);
    if (product.description) card.appendChild(desc);

    if (isService) {
      // Servicios: no precio, no carrito. Solo botón de contacto.
      var note = document.createElement("p");
      note.className = "service-note";
      note.textContent = "No se añade al carrito. Debe coordinar horario y detalles con anticipación.";
      card.appendChild(note);

      var btn = document.createElement("button");
      btn.className = "btn btn-primary btn-block";
      btn.type = "button";
      btn.textContent = "Ver cómo solicitar";
      btn.addEventListener("click", function () {
        showServiceModal(product);
      });
      card.appendChild(btn);
    } else {
      // Producto normal
      var price = document.createElement("div");
      price.className = "product-price";
      if (product.unit) {
        price.innerHTML =
          formatMoney(product.price) +
          ' <span class="product-unit">/ ' + escapeHtml(product.unit) + "</span>";
      } else {
        price.textContent = formatMoney(product.price);
      }

      var btn = document.createElement("button");
      btn.className = "btn btn-primary btn-block";
      btn.type = "button";
      btn.textContent = "A\u00f1adir al carrito";
      btn.addEventListener("click", function () {
        if (global.Cart) {
          global.Cart.addItem(product);
          var original = btn.textContent;
          btn.textContent = "\u2713 A\u00f1adido";
          btn.disabled = true;
          setTimeout(function () {
            btn.textContent = original;
            btn.disabled = false;
          }, 900);
        }
      });

      card.appendChild(price);
      card.appendChild(btn);
    }
    return card;
  }

  /* ======================================================================
     MODAL DE SERVICIOS — muestra números de contacto
     ====================================================================== */
  function showServiceModal(product) {
    var overlay = document.getElementById("serviceOverlay");
    var titleEl = document.getElementById("serviceModalTitle");
    var bodyEl = document.getElementById("serviceModalBody");
    if (!overlay || !titleEl || !bodyEl) {
      // Fallback si el modal no está en el HTML
      var contact = (global.PRODUCTS_DATA && global.PRODUCTS_DATA.serviceContact) ||
                    (CATALOG_EMBED && CATALOG_EMBED.serviceContact) || {};
      var msg = (product.contactText || "Coordine este servicio con anticipación.") +
        "\n\nTeléfonos fijos: " + (contact.fijos || []).join(" · ") +
        "\nMóviles: " + (contact.moviles || []).join(" · ");
      alert(msg);
      return;
    }

    titleEl.textContent = product.name;
    var contact = (global.PRODUCTS_DATA && global.PRODUCTS_DATA.serviceContact) ||
                  (CATALOG_EMBED && CATALOG_EMBED.serviceContact) || {};

    var html = "";
    if (product.description) {
      html += "<p>" + escapeHtml(product.description) + "</p>";
    }
    html += "<p><strong>¿Qué debe hacer?</strong></p>";
    html += "<p>" + escapeHtml(product.contactText || "Llame o escriba a los números de contacto para coordinar el servicio y el horario de antemano.") + "</p>";
    html += "<div class=\"service-contact-box\">";
    html += "<p><strong>Teléfonos fijos</strong><br>" + escapeHtml((contact.fijos || []).join(" · ")) + "</p>";
    html += "<p><strong>Teléfonos móviles</strong><br>" + escapeHtml((contact.moviles || []).join(" · ")) + "</p>";
    if (contact.note) {
      html += "<p class=\"service-note-small\">" + escapeHtml(contact.note) + "</p>";
    }
    html += "</div>";
    // Botones de llamada rápida
    html += "<div class=\"service-call-actions\">";
    (contact.moviles || []).forEach(function (num) {
      var clean = String(num).replace(/\\s+/g, "").replace(/^\\+/, "");
      html += '<a class="btn btn-primary" href="tel:+' + escapeHtml(clean) + '">Llamar ' + escapeHtml(num) + "</a>";
    });
    (contact.fijos || []).forEach(function (num) {
      html += '<a class="btn btn-outline" href="tel:' + escapeHtml(String(num)) + '">Fijo ' + escapeHtml(num) + "</a>";
    });
    html += "</div>";

    bodyEl.innerHTML = html;
    overlay.hidden = false;
    overlay.classList.add("is-visible");
  }

  function closeServiceModal() {
    var overlay = document.getElementById("serviceOverlay");
    if (!overlay) return;
    overlay.classList.remove("is-visible");
    setTimeout(function () { overlay.hidden = true; }, 250);
  }

  // Exponer cierre para el botón del modal
  global.closeServiceModal = closeServiceModal;

  // Cerrar al hacer clic fuera del modal o con Escape
  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.getElementById("serviceOverlay");
    if (overlay) {
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeServiceModal();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeServiceModal();
    });
  });

  /* ======================================================================
     UTILIDADES
     ====================================================================== */

  /**
   * Formato monetario con 2 decimales y separador de miles.
   * Usa la utilidad global Money (definida en cart.js, que se carga antes);
   * si no estuviera disponible, cae a un formato simple.
   */

  function formatMoney(n) {
    if (global.Money && typeof global.Money.format === "function") {
      return global.Money.format(n);
    }
    return (Number(n) || 0).toFixed(2);
  }

  /** Escape basico de HTML para valores insertados con innerHTML. */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /** Muestra el mensaje de error amigable si nada funciono. */
  function showError() {
    var loading = document.getElementById("loadingMsg");
    if (loading) loading.hidden = true;
    var box = document.getElementById("errorBox");
    if (box) box.hidden = false;
  }

  /* ======================================================================
     API PUBLICA
     ====================================================================== */
  global.Products = {
    load: load,
    getAll: function () { return products.slice(); },
    getCategories: function () { return categories.slice(); }
  };
})(window);
