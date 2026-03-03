# Dashboard de Glaciares & Minería de Argentina
### Guía para el Usuario
**Powered by ColossusLab.tech** · *Marzo 2026*

---

## ¿Qué es esta plataforma?

El **Dashboard de Glaciares & Minería** es una herramienta interactiva que permite explorar y cruzar cinco grandes bases de datos de Argentina en un mismo lugar:

- 🏔️ **Glaciares** — ubicación, superficie, tipo y cuencas hídricas
- ⛏️ **Proyectos mineros** — mineral, etapa y empresa operadora
- 🔋 **Litio especializado** — tipo de yacimiento, compuesto, reservas y proyecciones
- 📊 **ESG / Sostenibilidad** — regalías EITI, certificaciones TSM, empleo
- 🏭 **Cadena de suministros** — directorio de proveedores mineros (CAPMIN)

**Accedé desde:** [dashboardmineria.vercel.app](https://dashboardmineria.vercel.app)

---

## ¿Qué podés hacer con esta herramienta?

| Funcionalidad | Para qué sirve |
|---------------|----------------|
| 🗺️ Mapa interactivo | Ver la ubicación de glaciares, proyectos y capas geológicas |
| 🔍 Filtros | Acotar por provincia, mineral, etapa o tamaño del glaciar |
| 📊 Gráficos | Resúmenes visuales de superficies, minerales y etapas |
| ⚠️ Alertas de proximidad | Detectar proyectos mineros dentro de un radio configurable de glaciares |
| 🪨 Capa geológica SIGAM | Superponer las unidades geológicas oficiales de SEGEMAR |
| 🤖 ColossusAI | Preguntarle en lenguaje natural a una IA con memoria de conversación |

---

## Las bases de datos

### 🏔️ Glaciares — ING (IANIGLA / CONICET)

Argentina tiene **más de 16.900 glaciares** en la Cordillera, cubriendo **~8.484 km²** de hielo. Son reservas estratégicas de agua dulce para las provincias áridas del oeste.

#### Actualización Resolución 142/2024 *(NOA — Andes Desérticos)*
La plataforma incorpora los datos oficializados por la Secretaría de Minería que documentan la retracción glaciar en la región:

| Indicador | Resultado |
|-----------|-----------|
| Reducción de hielo descubierto | **−17%** (período 2008–2023) |
| Reducción de manchones de nieve perenne | **−23%** |
| Subcuencas con datos actualizados | 22 subcuencas del NOA |
| Provincias cubiertas | Catamarca, Jujuy, La Rioja, Salta, San Juan, Tucumán |

#### Superficie por provincia

| Provincia | Superficie glaciar | Glaciares |
|-----------|-------------------|-----------|
| Santa Cruz | 2.420 km² | 1.100 |
| San Juan | 1.767 km² | 308 |
| Mendoza | 1.239 km² | 650 |
| Catamarca | 277 km² | 180 |
| Tierra del Fuego | 218 km² | 328 |
| Salta | 212 km² | 120 |
| La Rioja | 65 km² | 85 |
| Jujuy | 59 km² | 65 |
| Chubut | 48 km² | 110 |
| Neuquén | 27 km² | 78 |

> [!NOTE]
> El mapa muestra **220 glaciares representativos**. Los totales (16.968 geoformas, 8.484 km²) corresponden al inventario completo del IANIGLA.

---

### ⛏️ Proyectos Mineros — SIACAM (Secretaría de Minería)

**82 proyectos de gran escala** en 11 provincias, con datos de empresa, mineral y etapa actualizada.

**Etapas del proyecto:**

| Etapa | Qué significa |
|-------|---------------|
| **Producción** | La mina está extrayendo activamente |
| **Construcción** | Se construye la infraestructura |
| **Factibilidad** | Se evalúa la viabilidad económica |
| **Exploración avanzada** | Perforaciones para confirmar reservas |
| **Mantenimiento / Cierre** | Operaciones pausadas o en proceso de cierre |

---

### 🔋 Módulo Litio Especializado

Datos específicos del litio que van más allá del SIACAM general:

| Campo | Ejemplo |
|-------|---------|
| Tipo de yacimiento | Salar / Roca |
| Compuesto producido | Carbonato de Litio / Hidróxido |
| Capacidad (t/año) | 40.000 — Cauchari-Olaroz |
| Reservas (Mt LCE) | 10,2 Mt — Cauchari-Olaroz |

**Argentina en el mundo:**
- 2.° lugar en **reservas globales** (20 Mt LCE = 22% mundial)
- Proyección de producción: **120 kt LCE en 2025 → 700 kt en 2035**

---

### 📊 ESG — Indicadores de Sostenibilidad (EITI / TSM / SIPA)

| Indicador | Dato |
|-----------|------|
| Regalías provinciales (sector minero) | ~USD 210 millones/año |
| Empleo directo formal (SIPA) | ~27.500 trabajadores |
| Participación de mujeres | ~11% del sector |
| Proyectos con reporte GRI | 8 |
| Proyectos adhiriendo al programa TSM | 28 |
| Minas con certificación TSM | 1 (Veladero, Barrick — desde mayo 2023) |

**TSM (Towards Sustainable Mining):** Estándar de sostenibilidad de la Mining Association of Canada, adoptado por la CAEM en 2016. Argentina fue el **primer país de Latinoamérica** en implementarlo. Evalúa relaves, agua, biodiversidad, clima, comunidades y seguridad.

---

### 🏭 Cadena de Suministros — CAPMIN

Directorio de la **Cámara Argentina de Proveedores Mineros** (180+ empresas, ~65% PyMEs):

| Rubro | Ejemplos |
|-------|---------|
| Explosivos y Voladura | EXSA Argentina, Austin Powder |
| Laboratorio y Análisis | Bureau Veritas, SGS Argentina |
| Tecnología y Sistemas | Hexagon Mining, Maptek |
| Servicios Ambientales | ERM Argentina, CICSA |
| Consultoría e Ingeniería | SRK Consulting, Ausenco |
| Energía renovable | Pro-Energía (solar/eólico para operaciones remotas) |

---

## Cómo funciona el análisis de proximidad

El sistema calcula en tiempo real qué tan cerca están los proyectos mineros de los glaciares y los clasifica:

| Distancia al glaciar más cercano | Nivel de alerta |
|----------------------------------|----------------|
| Menos de 10 km | 🔴 Crítico |
| Entre 11 y 25 km | 🟠 Alto |
| Entre 26 y 50 km | 🟡 Medio |
| Más de 50 km | 🟢 Bajo |

---

## ColossusAI — El asistente con memoria

En la esquina inferior derecha encontrarás **ColossusAI**, una IA entrenada sobre todas las bases de datos de la plataforma. A diferencia de un chatbot genérico, ColossusAI **recuerda el hilo de la conversación** y puede responder preguntas de seguimiento.

**Capacidades:**
- Análisis numérico con datos reales (rankings, cruces, proyecciones)
- Responde en Markdown con tablas cuando hay varios elementos para comparar
- Memoria de los últimos **20 turnos** de conversación
- Retry automático ante fallas de conexión
- Botón 🗑️ para limpiar y comenzar una nueva conversación

**Preguntas sugeridas por módulo:**

| Módulo | Pregunta de ejemplo |
|--------|---------------------|
| Glaciares | *¿Qué glaciares en San Juan están cerca de proyectos mineros?* |
| Retracción | *¿Cuánto hielo perdió la Puna entre 2008 y 2023?* |
| Litio | *¿Cuánto litio va a producir Argentina en 2030?* |
| ESG | *¿Cuántas regalías paga Veladero a la provincia de San Juan?* |
| Proveedores | *¿Qué proveedores de laboratorio hay en Catamarca?* |
| Conflicto | *¿Dónde hay mayor riesgo ambiental entre minería y glaciares?* |

---

## Capas del mapa

| Capa | Descripción | Estado por defecto |
|------|-------------|-------------------|
| Glaciares | Puntos azules escalados por superficie | ✅ Activa |
| Proyectos mineros | Puntos de colores por mineral | ✅ Activa |
| Periglacial | Ambiente periglacial y permafrost | Opcional |
| Alertas | Proyectos dentro del radio de glaciares | Opcional |
| 🆕 Geología SIGAM | Unidades geológicas de SEGEMAR (NOA + Cuyo) | Opcional |

---

## Fuentes de datos

| Dato | Fuente |
|------|--------|
| Glaciares (ING 2018) | IANIGLA / CONICET |
| Actualización NOA (2024) | Resolución 142/2024 — Secretaría de Minería |
| Proyectos mineros | SIACAM — datos.gob.ar |
| Litio (capacidad, reservas) | USGS / Benchmark Mineral Intelligence |
| ESG / Regalías | EITI Argentina — 4to Informe (FY 2022/23) |
| Empleo | SIPA — INDEC |
| TSM | CAEM / Mining Association of Canada |
| Proveedores | CAPMIN — capmin.com.ar |
| Geología | SIGAM — SEGEMAR (sigam.segemar.gov.ar) |
| Mapa base | OpenStreetMap / IGN Argentina |
| Inteligencia Artificial | Google Gemini 2.5 Flash |
| Desarrollo | **ColossusLab.tech** |

---

> [!NOTE]
> Los datos de proyectos mineros corresponden a la última versión disponible en datos.gob.ar. El estado de algunos proyectos puede haber cambiado desde la publicación original.

---

*© 2026 ColossusLab.tech — Todos los derechos reservados*
