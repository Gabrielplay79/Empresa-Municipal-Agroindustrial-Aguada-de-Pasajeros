/* ============================================================
   CATÁLOGO DE PRODUCTOS
   ------------------------------------------------------------
   Campos de cada producto:
     id        → número único (no repetir)
     nombre    → nombre del producto
     cat       → categoría: granos | viandas | frutas | insumos
     unidad    → presentación (ej: "saco 20 kg", "libra")
     precio    → número en CUP (moneda nacional)
     desc      → descripción corta
     seed      → nombre para la imagen (cámbielo para otra foto)
     etiqueta  → (opcional) texto del sello: "Temporada", "Nuevo"...
     tipo      → (opcional) "oliva" para sello verde, por defecto terracota
     destacada → (opcional) true = tarjeta doble de ancho
============================================================ */

const PRODUCTOS = [
  // --- Granos y semillas ---
  {id:1,  nombre:"Arroz Blanco",           cat:"granos",  unidad:"saco 20 kg",   precio:6800, desc:"Arroz de grano largo, selección de primera, listo para el consumo.", seed:"arroz-emaap-01",        etiqueta:"Temporada", destacada:true},
  {id:2,  nombre:"Frijol Negro",           cat:"granos",  unidad:"libra",        precio:380,  desc:"Grano seleccionado, cosecha del propio municipio.",                  seed:"frijol-negro-02"},
  {id:3,  nombre:"Frijol Colorado",        cat:"granos",  unidad:"libra",        precio:420,  desc:"Grano firme, de alto rendimiento en la cocina.",                     seed:"frijol-colorado-03"},
  {id:4,  nombre:"Maíz Amarillo",          cat:"granos",  unidad:"saco 50 kg",   precio:3200, desc:"Grano seco para la alimentación animal y la molienda.",              seed:"maiz-emaap-04"},
  {id:5,  nombre:"Picadillo de Soya",      cat:"granos",  unidad:"paquete 1 kg", precio:550,  desc:"Proteína vegetal para la elaboración de platos.",                    seed:"soya-emaap-05"},

  // --- Viandas y hortalizas ---
  {id:6,  nombre:"Papa",                   cat:"viandas", unidad:"malla 22.68 kg", precio:2100, desc:"Calibre uniforme, seleccionada a mano en el acopio.",              seed:"papa-emaap-06"},
  {id:7,  nombre:"Boniato",                cat:"viandas", unidad:"libra",        precio:85,   desc:"Dulce y firme, recién cosechado.",                                   seed:"boniato-emaap-07"},
  {id:8,  nombre:"Yuca",                   cat:"viandas", unidad:"libra",        precio:95,   desc:"Blanca, tierna y sin fibra.",                                        seed:"yuca-emaap-08"},
  {id:9,  nombre:"Tomate",                 cat:"viandas", unidad:"cajón 15 kg",  precio:1450, desc:"Maduro y firme, apto para consumo fresco o industria.",              seed:"tomate-emaap-09"},
  {id:10, nombre:"Cebolla",                cat:"viandas", unidad:"malla 10 kg",  precio:2400, desc:"Bulbo compacto de color intenso.",                                   seed:"cebolla-emaap-10"},

  // --- Frutas ---
  {id:11, nombre:"Mango",                  cat:"frutas",  unidad:"cajón 15 kg",  precio:950,  desc:"Fruta de campaña, seleccionada por calibre.",                        seed:"mango-emaap-11", etiqueta:"Temporada"},
  {id:12, nombre:"Aguacate",               cat:"frutas",  unidad:"cajón 12 kg",  precio:2600, desc:"Pulpa cremosa, lista para el consumo.",                              seed:"aguacate-emaap-12", etiqueta:"Orgánico", tipo:"oliva"},

  // --- Insumos agropecuarios ---
  {id:13, nombre:"Fertilizante NPK 17-17-17", cat:"insumos", unidad:"bulto 50 kg", precio:2500, desc:"Formulación equilibrada para todo tipo de cultivo.",              seed:"fertilizante-emaap-13"},
  {id:14, nombre:"Semilla Certificada de Maíz", cat:"insumos", unidad:"sobre 20 kg", precio:3500, desc:"Híbrido de alto rendimiento para la siembra.",                 seed:"semilla-emaap-14"},
];

const CATEGORIAS = {
  granos:  "Granos y semillas",
  viandas: "Viandas y hortalizas",
  frutas:  "Frutas",
  insumos: "Insumos agropecuarios",
};