/* ============================================================
   SERVICIOS DE LA EMPRESA
   ------------------------------------------------------------
   ► Para AGREGAR un servicio:
     copie un bloque { ... }, péguelo al final de la lista y
     cambie sus datos. Cuidando la coma entre bloques.

   ► Para QUITAR un servicio:
     borre su bloque completo (o coméntelo poniendo // al
     inicio de cada una de sus líneas).

   Campos:
     id          → identificador único (no repetir)
     nombre      → nombre del servicio
     icono       → nombre de icono de Lucide: https://lucide.dev/icons
     descripcion → descripción corta
     puntos      → lista corta de lo que incluye (puede ser [])
     enlace      → (opcional) a dónde lleva el botón, ej: "#combos"
     precio      → (opcional) número en CUP; si se omite se muestra
                   el botón "Solicitar"
============================================================ */

const SERVICIOS = [
  {
    id: "transportacion",
    nombre: "Transportación de Carga y Pasajeros",
    icono: "truck",
    descripcion: "Movilización de mercancías y personas dentro y fuera del municipio, con flota propia de camiones y ómnibus.",
    puntos: ["Carga ligera y pesada", "Rutas municipales e interprovinciales", "Choferes con experiencia"],
  },
  {
    id: "pintura-carpinteria",
    nombre: "Pintura y Carpintería",
    icono: "hammer",
    descripcion: "Trabajos de pintura, impermeabilización y carpintería de madera para viviendas, centros laborales e instituciones.",
    puntos: ["Pintura interior y exterior", "Puertas, ventanas y muebles a medida", "Reparación y acabados"],
  },
  {
    id: "contabilidad",
    nombre: "Asistencia Técnica — Contabilidad",
    icono: "calculator",
    descripcion: "Apoyo contable para trabajadores por cuenta propia, mipymes e instituciones del territorio.",
    puntos: ["Contabilidad general", "Declaraciones juradas", "Balances y registros"],
  },
  {
    id: "agricolas",
    nombre: "Servicios Agrícolas",
    icono: "tractor",
    descripcion: "Atención integral a productores y cooperativas, con maquinaria y brigadas especializadas.",
    puntos: ["Preparación de tierras", "Siembra y cosecha", "Asesoría técnica al cultivador"],
  },
  {
    id: "combos",
    nombre: "Combos Alimenticios",
    icono: "shopping-basket",
    descripcion: "Paquetes de alimentos elaborados con producción propia, pensados para familias y colectivos laborales.",
    puntos: ["Se arman a la medida del cliente", "Entrega coordinada"],
    enlace: "#combos",   // ← el botón baja hasta la sección de combos
  },
];