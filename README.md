# 🏔️ Dashboard de Glaciares & Minería de Argentina
### Guía del Usuario — v2.0
**Powered by [ColossusLab.tech](https://colossuslab.tech)** · *Marzo 2026*

---

## Índice

1. [¿Qué es esta plataforma?](#qué-es-esta-plataforma)
2. [Requisitos y acceso](#requisitos-y-acceso)
3. [Anatomía de la interfaz](#anatomía-de-la-interfaz)
4. [El mapa interactivo](#el-mapa-interactivo)
5. [Capas del mapa (7 capas)](#capas-del-mapa)
6. [Panel de filtros](#panel-de-filtros)
7. [Paneles de datos (4 pestañas)](#paneles-de-datos)
8. [Análisis de proximidad](#análisis-de-proximidad)
9. [ColossusAI — El asistente inteligente](#colossusai--el-asistente-inteligente)
10. [Las bases de datos](#las-bases-de-datos)
11. [Navegación móvil](#navegación-móvil)
12. [Fuentes de datos oficiales](#fuentes-de-datos-oficiales)
13. [Preguntas frecuentes](#preguntas-frecuentes)

---

## ¿Qué es esta plataforma?

El **Dashboard de Glaciares & Minería** es una herramienta de inteligencia geoespacial que permite explorar, filtrar y cruzar cinco grandes repositorios de datos de Argentina en una misma interfaz:

| Módulo | Datos | Fuente oficial |
|--------|-------|----------------|
| 🏔️ **Glaciares** | 16.888 geoformas · 2.718,9 km² de hielo | IANIGLA / CONICET |
| ⛏️ **Minería** | 906 proyectos (metalíferos + no metalíferos) en 23 provincias | SIACAM · datos.gob.ar |
| 🔋 **Litio** | Yacimientos, reservas, capacidad, proyecciones | USGS / Benchmark Mineral |
| 📊 **ESG** | Regalías EITI, empleos SIPA, certificaciones TSM | EITI Argentina / CAEM |
| 🏭 **CAPMIN** | 180+ proveedores mineros por rubro y provincia | capmin.com.ar |

> [!IMPORTANT]
> **La plataforma no requiere instalación.** Funciona en cualquier navegador moderno (Chrome, Firefox, Edge, Safari).

**Acceso directo:** [dashboardmineria.vercel.app](https://dashboardmineria.vercel.app)

---

## Requisitos y acceso

| Requisito | Detalle |
|-----------|---------|
| Navegador | Chrome 90+, Firefox 88+, Safari 15+, Edge 90+ |
| Conexión | Internet (para cargar mapas, capas WMS y chatbot) |
| Dispositivo | Desktop, tablet o celular (responsive) |
| Cuenta | No requiere registro ni inicio de sesión |

---

## Anatomía de la interfaz

La plataforma tiene un diseño de **tres columnas** en escritorio:

```
┌──────────────────────────────────────────────────────┐
│                    ENCABEZADO                         │
│  🏔️ Glaciares & Minería  [16,888] [2,719] [906] [0] │
├──────────┬──────────────────────┬────────────────────┤
│          │                      │                    │
│ SIDEBAR  │        MAPA          │   PANELES          │
│ (Filtros │   (Leaflet map       │   (4 pestañas:     │
│  y capas)│    interactivo)      │    Resumen,        │
│          │                      │    Análisis,       │
│          │                      │    Minerales,      │
│          │                      │    Sostenibilidad) │
│          │                      │                    │
├──────────┴──────────────────────┴────────────────────┤
│                   🧠 ColossusAI (FAB flotante)       │
└──────────────────────────────────────────────────────┘
```

### Encabezado (Header)

El encabezado muestra **4 KPIs en tiempo real** que se actualizan con cada filtro aplicado:

| KPI | Descripción | Color |
|-----|-------------|-------|
| **Geoformas Totales** | Total de glaciares + ambientes periglaciales cargados | 🔵 Celeste |
| **km² Glaciares** | Superficie total de hielo de los glaciares filtrados | 🔵 Azul |
| **Proyectos Mineros** | Total de proyectos mineros visibles | 🟠 Naranja |
| **Indicadores Proximidad** | Proyectos dentro del radio configurado de un glaciar | 🔵 Azul |

---

## El mapa interactivo

El mapa central está construido con **Leaflet.js** y utiliza tiles de OpenStreetMap / CartoDB / IGN Argentina.

### Controles del mapa

| Control | Acción |
|---------|--------|
| **Rueda del mouse** | Zoom in/out |
| **Click + arrastrar** | Desplazar la vista |
| **Click en marcador** | Abre popup con información detallada |
| **Click en provincia** | Filtra automáticamente por esa provincia |
| **Doble click** | Zoom rápido al punto |

### Popups informativos

Al hacer click en un marcador se despliega un popup con datos específicos:

**Popup de Glaciar:**
- Nombre del glaciar o geoforma
- Tipo (Glaciar / Ambiente Periglacial)
- Superficie en km²
- Cuenca hídrica asociada
- Altitud y provincia

**Popup de Proyecto Minero:**
- Nombre del proyecto
- Empresa operadora
- Mineral principal
- Etapa actual (Producción, Exploración, etc.)
- Provincia y coordenadas

### Barra informativa de provincia

Al hacer click en una provincia del mapa, aparece una **barra superior translúcida** con las estadísticas agregadas:

- Cantidad de geoformas en esa provincia
- Superficie total en km²
- Proyectos mineros activos
- Indicadores de proximidad
- Botón **✕** para limpiar el filtro provincial

### Clustering de marcadores

Cuando el mapa tiene un zoom alejado, los marcadores se **agrupan automáticamente** en clusters con números que indican la cantidad de puntos contenidos. Al hacer zoom, los clusters se despliegan mostrando los marcadores individuales.

---

## Capas del mapa

El dashboard ofrece **7 capas** que se activan/desactivan desde el panel lateral:

| # | Capa | Descripción | Estado por defecto |
|---|------|-------------|-------------------|
| 1 | 🔵 **Glaciares** | Puntos azules escalados por superficie | ✅ Activa |
| 2 | 🟣 **Ambiente Periglacial** | Ambientes periglaciales y permafrost | ✅ Activa |
| 3 | 🟠 **Proyectos Mineros** | Puntos de colores según mineral | ✅ Activa |
| 4 | 🔵 **Indicadores de Proximidad** | Proyectos dentro del radio de glaciares | ✅ Activa |
| 5 | 🗺️ **Polígonos Glaciares** | Contornos reales IANIGLA (GeoJSON) | ⬜ Opcional |
| 6 | 🧊 **Geología SIGAM** | Unidades geológicas SEGEMAR (WMS) | ⬜ Opcional |
| 7 | 🟢 **Límites provinciales** | Contornos de las 12 provincias cordilleranas | ✅ Activa |

### Capa de polígonos glaciares

Los polígonos represetan los **contornos reales** de los glaciares según el Inventario Nacional (IANIGLA). Están coloreados por tipo geomorfológico:

| Tipo | Color |
|------|-------|
| Glaciar de escombros | 🟤 Marrón |
| Glaciar descubierto | 🔵 Azul celeste |
| Glaciar cubierto | 🟢 Verde azulado |
| Manchón de nieve | ⚪ Blanco |

### Capa SIGAM (Geología de SEGEMAR)

Esta capa WMS superpone las **unidades geológicas oficiales** del Sistema de Información Geológico Ambiental Minero (SIGAM). Cubre las regiones del NOA y Cuyo.

---

## Panel de filtros

El panel lateral izquierdo contiene **5 grupos de filtros** interactivos. Cada filtro actualiza en tiempo real el mapa, los gráficos y las estadísticas del encabezado.

### 1. Provincia

Menú desplegable con las **12 provincias** cordilleranas:
Jujuy, Salta, Tucumán, Catamarca, La Rioja, San Juan, Mendoza, Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego.

- Seleccioná una provincia para centrar el mapa y mostrar solo sus datos.
- También podés hacer **click directo en el mapa** sobre una provincia.

### 2. Tipo de Glaciar

Chips seleccionables para filtrar por tipo de geoforma:
- **Glaciar** — Cuerpos de hielo permanente
- **Periglacial** — Ambientes periglaciales (permafrost, glaciares de roca)

Incluye un **slider de superficie mínima** (0–100 km²) para filtrar glaciares por tamaño.

### 3. Tipo de Proyecto

**2 chips** para filtrar por tipo de proyecto minero:
- **Metalífero** — Proyectos de minería metalífera y litio (212 proyectos)
- **No Metalífero** — Canteras, rocas de aplicación y minerales industriales (694 proyectos)

### 4. Minerales

**13 chips de minerales metalíferos**, cada uno con su color distintivo:

| Mineral | Color del chip | Mineral | Color del chip |
|---------|---------------|---------|---------------|
| Cobre | 🟠 Naranja | Potasio | 🔴 Rojo |
| Oro | 🟡 Dorado | Hierro | 🟤 Marrón |
| Plata | ⚪ Gris claro | Plomo | ⬜ Gris |
| Litio | 🔵 Celeste | Carbón | ⚫ Negro |
| Uranio | 🟢 Verde | | |

Hacé click en un chip para **activar/desactivar** el filtro de ese mineral. Los chips activos tienen borde iluminado.

### 5. Etapa del Proyecto

**10 etapas del ciclo minero** como chips:

| Etapa | Descripción |
|-------|-------------|
| **Producción** | La mina extrae mineral activamente |
| **Construcción** | Se construye infraestructura minera |
| **Factibilidad** | Evaluación de viabilidad económica |
| **Prefactibilidad** | Estudios preliminaries de viabilidad |
| **Exploración avanzada** | Perforaciones para confirmar reservas |
| **Evaluación económica** | Análisis económico preliminar |
| **Prospección** | Etapa inicial de búsqueda |
| **Exploración inicial** | Primeros trabajos de exploración |
| **Cese de operaciones** | Operaciones suspendidas o en cierre |
| **Proceso de Cierre** | Cierre formal y remediación |

### 6. Radio de Proximidad

**4 botones** para configurar el radio de análisis de proximidad entre proyectos mineros y glaciares:

| Radio | Uso recomendado |
|-------|----------------|
| **10 km** | Zona inmediata |
| **25 km** | Radio estándar (por defecto) |
| **50 km** | Área de influencia media |
| **100 km** | Contexto regional |

### Botón "Restablecer Filtros"

Un botón al final del sidebar permite **limpiar todos los filtros** de una vez y volver al estado inicial del dashboard.

---

## Paneles de datos

El panel derecho contiene **4 pestañas** con visualizaciones y tablas:

### Pestaña 1: Resumen

| Elemento | Detalle |
|----------|---------|
| **6 tarjetas métricas** | Glaciares, Periglacial, Proyectos Mineros, Alertas, Superficie, Provincias |
| **Gráfico: Geoformas por Provincia** | Barras horizontales — cantidad de glaciares por provincia |
| **Gráfico: Superficie Glaciar (km²)** | Barras horizontales — superficie total de hielo por provincia |

### Pestaña 2: Análisis

| Elemento | Detalle |
|----------|---------|
| **Proyectos Mineros por Provincia** | Distribución geográfica de la actividad minera |
| **Proyectos por Etapa** | Distribución por ciclo de vida (Producción, Construcción, etc.) |
| **Proyectos cerca de Glaciares** | Análisis de proximidad por categoría de distancia |

### Pestaña 3: Minerales

| Elemento | Detalle |
|----------|---------|
| **Mineral predominante en áreas glaciares** | Qué mineral se explota más cerca de los glaciares |
| **Glaciares asociados por mineral** | Cuántos glaciares tiene cada mineral dentro del radio |
| **Ranking de presencia mineral** | Distribución total de proyectos por tipo de mineral |

### Pestaña 4: 📊 Sostenibilidad

| Elemento | Detalle |
|----------|---------|
| **KPIs nacionales ESG** | 6 tarjetas: Regalías (USD 210M), Empleo (27.500), Mujeres (11%), TSM (28), Certificada (1), GRI (8) |
| **Tabla ESG por proyecto** | Columnas: Proyecto, Regalías, Empleo, Mujeres, TSM |
| **Directorio CAPMIN** | Buscador + filtro por rubro · 180+ proveedores mineros |

#### Directorio CAPMIN

El directorio de la **Cámara Argentina de Proveedores Mineros** incluye:
- **Buscador de texto** para encontrar empresas específicas
- **Filtro por rubro** (Explosivos, Laboratorio, Tecnología, Ambiental, etc.)
- Tarjetas con: nombre de la empresa, productos/servicios, provincias donde operan

---

## Análisis de proximidad

El motor de análisis espacial utiliza la **fórmula de Haversine** para calcular distancias geodésicas entre cada proyecto minero y todos los glaciares del inventario. Los resultados se clasifican en 4 categorías de proximidad:

| Distancia al glaciar más cercano | Categoría | Color |
|----------------------------------|-------|-------|
| Menos de 10 km | 🔵 **Inmediata** | Azul oscuro |
| Entre 11 y 25 km | 🔵 **Cercana** | Azul |
| Entre 26 y 50 km | 🔵 **Media** | Azul claro |
| Más de 50 km | 🔵 **Lejana** | Azul pálido |

> [!NOTE]
> Las categorías son indicadores de distancia lineal. No implican evaluación de riesgo ambiental.

### ¿Cómo funciona?

1. Para cada proyecto minero, el sistema calcula la distancia a **todos** los glaciares
2. Identifica el **glaciar más cercano** y la distancia en kilómetros
3. Cuenta cuántos glaciares caen **dentro del radio** configurado
4. Asigna una **categoría de proximidad** basada en la distancia mínima
5. Los resultados alimentan los indicadores del header, los gráficos y el chatbot

### ¿Cómo ajustar el radio?

Usá los botones de **Radio de Proximidad** en el sidebar (10, 25, 50 o 100 km). Al cambiar el radio, se recalculan automáticamente todos los indicadores y gráficos.

---

## ColossusAI — El asistente inteligente

ColossusAI es un chatbot de inteligencia artificial integrado en el dashboard, ubicado como un **botón flotante (🧠)** en la esquina inferior derecha.

### Abrir y cerrar

- **Click en el botón 🧠** para abrir la ventana de chat
- **Click en ⌄** para minimizar la ventana

### Capacidades

| Función | Detalle |
|---------|---------|
| **Datos en tiempo real** | Responde con las cifras actuales del dashboard |
| **Análisis cruzado** | Cruza datos de glaciares, minería, litio, ESG y CAPMIN |
| **Memoria conversacional** | Recuerda los últimos **20 turnos** de la conversación |
| **Respuestas enriquecidas** | Markdown con tablas, listas, negrita y código |
| **Retry automático** | Reintenta hasta 3 veces ante fallas de conexión |
| **Exportar conversación** | Botón 📥 para descargar el historial |
| **Limpiar historial** | Botón 🗑️ para reiniciar la conversación |

### Preguntas sugeridas

Al abrir el chatbot, aparecen **8 sugerencias** clickeables:

| Módulo | Pregunta de ejemplo |
|--------|---------------------|
| Glaciares | 🏔️ *¿Qué glaciares en San Juan están cerca de minería?* |
| Litio | ⚗️ *¿Cuántos proyectos de litio están en producción?* |
| Superficie | 📊 *¿Qué provincia tiene más superficie glaciar?* |
| ESG | 💰 *¿Cuántas regalías paga Veladero a San Juan?* |
| Cuencas | 💧 *¿Qué glaciares alimentan el Río Mendoza?* |
| Riesgo | ⚠️ *¿Dónde hay mayor conflicto minería-glaciares?* |
| Proyecciones | 🔋 *¿Cuánto litio va a producir Argentina en 2030?* |
| Proveedores | 🏭 *¿Qué proveedores locales hay en Jujuy?* |

### Motor de IA

ColossusAI está potenciado por **Google Gemini 2.5 Flash** a través de una API serverless en Vercel. El prompt del sistema incluye todas las bases de datos del dashboard como contexto, permitiendo respuestas precisas basadas en datos reales.

---

## Las bases de datos

### 🏔️ Glaciares — Inventario Nacional (IANIGLA / CONICET)

Argentina tiene **más de 16.900 glaciares** en la Cordillera, cubriendo **~8.484 km²** de hielo. Son reservas estratégicas de agua dulce para las provincias áridas del oeste.

#### Actualización Resolución 142/2024 (NOA — Andes Desérticos)

La plataforma incorpora los datos oficializados por la Secretaría de Minería:

| Indicador | Resultado |
|-----------|-----------|
| Reducción de hielo descubierto | **−17%** (período 2008–2023) |
| Reducción de manchones de nieve perenne | **−23%** |
| Subcuencas actualizadas | 22 subcuencas del NOA |
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

**906 proyectos mineros** (212 metalíferos + 694 no metalíferos) en 23 provincias, con datos de empresa, mineral y etapa actualizada según SIACAM.

**Etapas del ciclo minero:**

| Etapa | Qué significa |
|-------|---------------|
| **Producción** | La mina extrae activamente |
| **Construcción** | Se construye la infraestructura |
| **Factibilidad** | Evaluación de viabilidad económica |
| **Prefactibilidad** | Estudios preliminares de viabilidad |
| **Exploración avanzada** | Perforaciones para confirmar reservas |
| **Evaluación económica** | Análisis económico preliminar |
| **Mantenimiento / Cierre** | Operaciones pausadas o en cierre |

---

### 🔋 Módulo Litio Especializado

Datos específicos del litio que van más allá del SIACAM general:

| Campo | Ejemplo |
|-------|---------| 
| Tipo de yacimiento | Salar / Roca |
| Compuesto producido | Carbonato de Litio / Hidróxido |
| Capacidad (t/año) | 40.000 — Cauchari-Olaroz |
| Reservas (Mt LCE) | 10,2 Mt — Cauchari-Olaroz |
| Inicio producción | Fechas proyectadas por proyecto |
| Concentración | ppm de Li en salmuera |

**Argentina en el mundo:**
- 2.° lugar en **reservas globales** (20 Mt LCE = 22% mundial)
- Proyección: **120 kt LCE en 2025 → 700 kt en 2035**
- Triángulo del Litio (Argentina, Chile, Bolivia): **56% de reservas mundiales**

---

### 📊 ESG — Indicadores de Sostenibilidad (EITI / TSM / SIPA)

| Indicador | Dato |
|-----------|------|
| Regalías provinciales (sector minero) | ~USD 210 millones/año |
| Empleo directo formal (SIPA) | ~27.500 trabajadores |
| Participación de mujeres | ~11% del sector |
| Proyectos con reporte GRI | 8 |
| Proyectos adhiriendo al programa TSM | 28 |
| Minas con certificación TSM | 1 (Veladero, Barrick — mayo 2023) |

**TSM (Towards Sustainable Mining):** Estándar de la Mining Association of Canada, adoptado por la CAEM en 2016. Argentina fue el **primer país de Latinoamérica** en implementarlo. Evalúa: relaves, agua, biodiversidad, clima, comunidades y seguridad.

---

### 🏭 Cadena de Suministros — CAPMIN

Directorio de la **Cámara Argentina de Proveedores Mineros** (~180+ empresas, ~65% PyMEs):

| Rubro | Ejemplos |
|-------|---------| 
| Explosivos y Voladura | EXSA Argentina, Austin Powder |
| Laboratorio y Análisis | Bureau Veritas, SGS Argentina |
| Tecnología y Sistemas | Hexagon Mining, Maptek |
| Servicios Ambientales | ERM Argentina, CICSA |
| Consultoría e Ingeniería | SRK Consulting, Ausenco |
| Energía renovable | Pro-Energía (solar/eólico) |
| Equipamiento pesado | Caterpillar, Komatsu |
| Logística y Transporte | Andreani, Transportes Cruz del Sur |

---

## Navegación móvil

En dispositivos móviles, la interfaz se reorganiza mostrando **una sección a la vez** con una **barra de navegación inferior**:

| Botón | Vista |
|-------|-------|
| 🗺️ **Mapa** | El mapa interactivo a pantalla completa |
| 📊 **Análisis** | Los 4 paneles de datos (Resumen, Análisis, Minerales, ESG) |
| ⚙️ **Filtros** | El sidebar con todas las opciones de filtrado |

El botón de **ColossusAI (🧠)** permanece accesible en todas las vistas.

---

## Fuentes de datos oficiales

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
| Desarrollo | **[ColossusLab.tech](https://colossuslab.tech)** |

---

## Preguntas frecuentes

**¿Los datos se actualizan en tiempo real?**
No. Las bases de datos están embebidas en la aplicación y corresponden a las últimas versiones disponibles de cada fuente oficial. Las actualizaciones se realizan periódicamente.

**¿Puedo descargar los datos?**
Podés exportar la conversación con ColossusAI usando el botón 📥. Para datos crudos, consultá las fuentes oficiales listadas en la sección anterior.

**¿El chatbot tiene acceso a internet?**
ColossusAI responde exclusivamente con los datos integrados en la plataforma. No busca información externa, lo que garantiza respuestas verificables.

**¿Puedo usar la plataforma sin conexión a internet?**
No. Se requiere conexión para cargar los tiles del mapa, las capas WMS (SIGAM) y para que funcione el chatbot (API de Gemini).

**¿Qué navegadores son compatibles?**
Chrome 90+, Firefox 88+, Safari 15+, Edge 90+. Recomendamos Chrome para la mejor experiencia.

**¿El estado de los proyectos mineros es el actual?**
Corresponde a la última versión disponible en datos.gob.ar (SIACAM). El estado de algunos proyectos puede haber cambiado desde la publicación original.

---

> [!NOTE]
> Esta guía fue generada a partir del análisis completo del código fuente, estructura de datos y funcionalidad de la plataforma.

---

*© 2026 [ColossusLab.tech](https://colossuslab.tech) — Todos los derechos reservados*
