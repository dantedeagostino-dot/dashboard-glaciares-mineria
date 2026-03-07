# 🏔️ Dashboard de Glaciares & Minería de Argentina
### Guía del Usuario — v3.0
**Powered by [ColossusLab.tech](https://colossuslab.tech)** · *Marzo 2026*

---

## Índice

1. [¿Qué es esta plataforma?](#qué-es-esta-plataforma)
2. [Requisitos y acceso](#requisitos-y-acceso)
3. [Arquitectura técnica](#arquitectura-técnica)
4. [Anatomía de la interfaz](#anatomía-de-la-interfaz)
5. [El mapa interactivo](#el-mapa-interactivo)
6. [Capas del mapa (7 capas)](#capas-del-mapa)
7. [Panel de filtros](#panel-de-filtros)
8. [Paneles de datos (4 pestañas)](#paneles-de-datos)
9. [Análisis de proximidad](#análisis-de-proximidad)
10. [ColossusAI — El asistente inteligente](#colossusai--el-asistente-inteligente)
11. [Las bases de datos](#las-bases-de-datos)
12. [Navegación móvil](#navegación-móvil)
13. [Seguridad](#seguridad)
14. [Despliegue y hosting](#despliegue-y-hosting)
15. [Fuentes de datos oficiales](#fuentes-de-datos-oficiales)
16. [Preguntas frecuentes](#preguntas-frecuentes)

---

## ¿Qué es esta plataforma?

El **Dashboard de Glaciares & Minería** es una herramienta de inteligencia geoespacial que permite explorar, filtrar y cruzar seis grandes repositorios de datos de Argentina en una misma interfaz:

| Módulo | Datos | Fuente oficial |
|--------|-------|----------------|
| 🏔️ **Glaciares** | 16.968 geoformas · ~8.484 km² de hielo | IANIGLA / CONICET |
| ⛏️ **Minería** | 906 proyectos (metalíferos + no metalíferos) en 23 provincias | SIACAM · datos.gob.ar |
| 🔋 **Litio** | Yacimientos, reservas, capacidad, proyecciones | USGS / Benchmark Mineral |
| 📊 **ESG** | Pagos fiscales, regalías, empleo, agua, energía, GEI, TSM | EITI / SIACAM 2023 / CAEM |
| 🏭 **CAPMIN** | 180+ proveedores mineros por rubro y provincia | capmin.com.ar |
| ⚖️ **Marco Legal** | Ley 26.639, Ley 24.585, Resolución 142/2024 | Congreso Nacional / Sec. de Minería |

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

## Arquitectura técnica

El dashboard es una **aplicación estática single-page** desplegada en Vercel, con un solo endpoint serverless para el chatbot de IA.

### Stack tecnológico

| Componente | Tecnología |
|------------|------------|
| **Frontend** | HTML5 + Vanilla CSS + JavaScript (ES6+, módulos IIFE) |
| **Mapas** | Leaflet.js 1.9.4 + MarkerCluster |
| **Gráficos** | Chart.js 4.4.1 |
| **Iconografía** | Font Awesome 6.5.1 |
| **Estilos** | Design system propio: dark-mode, glassmorphism, custom CSS variables |
| **Backend IA** | Vercel Serverless Function (Node.js) con `@google/generative-ai` |
| **Modelo IA** | Google Gemini 2.5 Flash |
| **Hosting** | Vercel (con headers de seguridad y analytics integrados) |

### Estructura de archivos

```
Dashboard mineria/
├── index.html                  # Punto de entrada SPA
├── css/
│   └── styles.css              # Design system completo (~2.200 líneas)
├── js/
│   ├── app.js                  # Módulo principal: mapa, capas, marcadores, popups
│   ├── analysis.js             # Motor de análisis espacial con índice de grilla
│   ├── charts.js               # Gráficos Chart.js (barras, comparativos)
│   ├── filters.js              # Lógica de filtrado reactivo (chips, selects, sliders)
│   ├── esg.js                  # Panel de sostenibilidad + directorio CAPMIN
│   └── chat.js                 # Interfaz de ColossusAI (v3.0: Markdown, gráficos inline)
├── data/
│   ├── glaciares.js            # ~6 MB — 16.968 geoformas con coordenadas
│   ├── mineria.js              # 906 proyectos mineros con metadata
│   ├── provincias.js           # Polígonos provinciales (12 provincias cordilleranas)
│   ├── litio.js                # Módulo especializado de litio
│   ├── esg.js                  # 18 operaciones con indicadores SIACAM 2023
│   ├── capmin.js               # 180+ proveedores CAPMIN
│   ├── glaciares_polygons.geojson  # Contornos reales IANIGLA (~5.7 MB)
│   └── provincias_real.geojson     # Polígonos provinciales detallados (~13 MB)
├── api/
│   └── chat.js                 # Serverless function: Gemini + contexto del dashboard
├── vercel.json                 # Config de deploy: headers CSP y seguridad
└── package.json                # Dependencia: @google/generative-ai
```

---

## Anatomía de la interfaz

La plataforma tiene un diseño de **tres columnas** en escritorio:

```
┌──────────────────────────────────────────────────────┐
│                    ENCABEZADO                         │
│  🏔️ Glaciares & Minería  [16,968] [8,484] [82] [0]  │
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
| **Proy. Metalíferos** | Total de proyectos mineros metalíferos visibles | 🟠 Naranja |
| **En Proximidad** | Proyectos dentro del radio configurado de un glaciar | 🔵 Azul |

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
- Tipo (Amb. Glacial / Amb. Periglacial)
- Superficie en km²
- Cuenca hídrica asociada
- Altitud y provincia
- Proyecto minero más cercano y distancia (pre-calculada)

**Popup de Proyecto Minero:**
- Nombre del proyecto
- Empresa operadora
- Mineral principal
- Etapa actual (Producción, Exploración, etc.)
- Provincia y coordenadas
- Glaciar más cercano y distancia (pre-calculada)
- Cantidad de glaciares dentro del radio configurado

### Barra informativa de provincia

Al hacer click en una provincia del mapa, aparece una **barra superior translúcida** con las estadísticas agregadas:

- Cantidad de geoformas en esa provincia
- Superficie total en km²
- Proyectos mineros activos
- Indicadores de proximidad
- Botón **✕** para limpiar el filtro provincial

### Clustering de marcadores

Cuando el mapa tiene un zoom alejado, los marcadores se **agrupan automáticamente** en clusters con números que indican la cantidad de puntos contenidos. Al hacer zoom, los clusters se despliegan mostrando los marcadores individuales. Se utilizan clusters separados para glaciares/periglaciales y para proyectos mineros.

---

## Capas del mapa

El dashboard ofrece **7 capas** que se activan/desactivan desde el panel lateral:

| # | Capa | Descripción | Estado por defecto |
|---|------|-------------|-------------------|
| 1 | 🔵 **Amb. Glacial** | Puntos azules escalados por superficie | ✅ Activa |
| 2 | 🟣 **Amb. Periglacial** | Ambientes periglaciales y permafrost | ✅ Activa |
| 3 | 🟠 **Proyectos Mineros** | Puntos de colores según mineral | ✅ Activa |
| 4 | 🔴 **Indicadores de Proximidad** | Proyectos dentro del radio de glaciares | ✅ Activa |
| 5 | 🗺️ **Polígonos Glaciares** | Contornos reales IANIGLA (GeoJSON) | ⬜ Opcional |
| 6 | 🧊 **Geología SIGAM** | Unidades geológicas SEGEMAR (WMS) | ⬜ Opcional |
| 7 | 🟢 **Límites provinciales** | Contornos de las 12 provincias cordilleranas | ✅ Activa |

### Capa de polígonos glaciares

Los polígonos representan los **contornos reales** de los glaciares según el Inventario Nacional (IANIGLA). Están coloreados por tipo geomorfológico:

| Código | Tipo | Color |
|--------|------|-------|
| GD | Glaciar Descubierto | 🔵 Cian |
| GC | Glaciar Cubierto | 🔵 Azul |
| GCGE | Glaciar Cubierto / Geoforma Periglaciar | 🟡 Amarillo |
| GEA | Geoforma de Ambiente Glaciar | 🟢 Verde |
| GEI | Geoforma de Ambiente Periglacial | 🟠 Naranja |
| MN | Manchón de Nieve | ⚪ Blanco |

### Capa SIGAM (Geología de SEGEMAR)

Esta capa WMS superpone las **unidades geológicas oficiales** del Sistema de Información Geológico Ambiental Minero (SIGAM). Cubre las regiones del NOA y Cuyo.

---

## Panel de filtros

El panel lateral izquierdo contiene **6 grupos de filtros** interactivos. Cada filtro actualiza en tiempo real el mapa, los gráficos y las estadísticas del encabezado.

### 1. Provincia

Menú desplegable con las **12 provincias** cordilleranas:
Jujuy, Salta, Tucumán, Catamarca, La Rioja, San Juan, Mendoza, Neuquén, Río Negro, Chubut, Santa Cruz, Tierra del Fuego.

- Seleccioná una provincia para centrar el mapa y mostrar solo sus datos.
- También podés hacer **click directo en el mapa** sobre una provincia.

### 2. Tipo de Geoforma

Chips seleccionables para filtrar por tipo de geoforma:
- **Amb. Glacial** — Cuerpos de hielo permanente
- **Amb. Periglacial** — Ambientes periglaciales (permafrost, glaciares de roca)

Incluye un **slider de superficie mínima** (0–100 km²) para filtrar glaciares por tamaño.

### 3. Minerales

**12 chips de minerales metalíferos**, cada uno con su color distintivo:

| Mineral | Color del chip | Mineral | Color del chip |
|---------|---------------|---------|---------------|
| Cobre | 🟠 Naranja | Potasio | 🔴 Rojo |
| Oro | 🟡 Dorado | Hierro | 🟤 Marrón |
| Plata | ⚪ Gris claro | Plomo | ⬜ Gris |
| Litio | 🔵 Celeste | Carbón | ⚫ Negro |
| Uranio | 🟢 Verde | Manganeso | 🟣 Violeta |
| Estaño | 🟧 Naranja oscuro | Cesio | 🟩 Verde azulado |

Hacé click en un chip para **activar/desactivar** el filtro de ese mineral. Los chips activos tienen borde iluminado.

### 4. Etapa del Proyecto

**9 etapas del ciclo minero** como chips:

| Etapa | Descripción |
|-------|-------------|
| **Producción** | La mina extrae mineral activamente |
| **Construcción** | Se construye infraestructura minera |
| **Factibilidad** | Evaluación de viabilidad económica |
| **Prefactibilidad** | Estudios preliminares de viabilidad |
| **Exploración avanzada** | Perforaciones para confirmar reservas |
| **Evaluación económica** | Análisis económico preliminar |
| **Prospección** | Etapa inicial de búsqueda |
| **Exploración inicial** | Primeros trabajos de exploración |
| **Cese de operaciones** | Operaciones suspendidas o en cierre |

### 5. Radio de Proximidad

**4 botones** para configurar el radio de análisis de proximidad entre proyectos mineros y glaciares:

| Radio | Uso recomendado |
|-------|----------------|
| **10 km** | Zona inmediata |
| **25 km** | Radio estándar (por defecto) |
| **50 km** | Área de influencia media |
| **100 km** | Contexto regional |

### 6. Botón "Restablecer Filtros"

Un botón al final del sidebar permite **limpiar todos los filtros** de una vez y volver al estado inicial del dashboard.

---

## Paneles de datos

El panel derecho contiene **4 pestañas** con visualizaciones y tablas:

### Pestaña 1: Resumen

| Elemento | Detalle |
|----------|---------|
| **6 tarjetas métricas** | Amb. Glacial, Amb. Periglacial, Proy. Metalíferos, En Proximidad, Superficie km², Provincias |
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
| **KPIs nacionales ESG** | 6 tarjetas: Pagos fiscales (USD 637M), Regalías (USD 210M), Empleo (27.500), Mujeres (11%), TSM (28), Inversiones anunciadas (USD 23.1B) |
| **Tabla ESG por proyecto (18 operaciones)** | 9 columnas: Proyecto, Impuestos 2023, Regalías 2023, Agua (m³), Energía (MWh), GEI (tCO₂e), Empleo, Mujeres, TSM |
| **Directorio CAPMIN** | Buscador + filtro por rubro · 180+ proveedores mineros |

#### Directorio CAPMIN

El directorio de la **Cámara Argentina de Proveedores Mineros** incluye:
- **Buscador de texto** para encontrar empresas específicas
- **Filtro por rubro** (Explosivos, Laboratorio, Tecnología, Ambiental, etc.)
- Tarjetas con: nombre, productos/servicios, tag PyME/Gran empresa, Exportadora, provincias donde operan

---

## Análisis de proximidad

### Motor de análisis espacial

El sistema utiliza un **índice espacial basado en grillas** (`analysis.js`) para evitar cálculos brute-force O(n×m). La optimización incluye:

| Técnica | Detalle |
|---------|---------|
| **Grid-based spatial index** | Celdas de 0.5° (~55 km) con glaciares pre-indexados |
| **Memoización** | Caché de resultados por combinación de parámetros |
| **Fórmula de Haversine** | Cálculo geodésico preciso de distancias |
| **Pre-cómputo bidireccional** | Cada glaciar sabe su proyecto más cercano y viceversa |

### Categorías de proximidad

| Distancia al glaciar más cercano | Categoría |
|----------------------------------|-----------|
| Menos de 10 km | 🔵 **Inmediata** |
| Entre 11 y 25 km | 🔵 **Cercana** |
| Entre 26 y 50 km | 🔵 **Media** |
| Más de 50 km | 🔵 **Lejana** |

> [!NOTE]
> Las categorías son indicadores de distancia lineal. No implican evaluación de riesgo ambiental.

### ¿Cómo funciona?

1. Se construye un **índice espacial de grilla** con todos los glaciares al iniciar
2. Para cada proyecto minero, se consultan solo las **celdas vecinas** (no todos los glaciares)
3. Se identifica el **glaciar más cercano** con distancia exacta en km
4. Se cuentan los glaciares **dentro del radio** configurado
5. Se asigna una **categoría de proximidad** basada en la distancia mínima
6. Los resultados alimentan los indicadores del header, los gráficos y ColossusAI

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
| **6 bases de datos cruzadas** | Cruza glaciares, minería, litio, ESG, CAPMIN y cuencas hídricas |
| **Proximidad pre-calculada** | Usa las distancias Haversine del motor espacial (no adivina) |
| **Memoria conversacional** | Recuerda los últimos **20 turnos** de la conversación |
| **Respuestas enriquecidas** | Markdown con tablas, listas, negrita, código y gráficos inline |
| **Gráficos inline** | Genera gráficos Chart.js (bar, pie, doughnut) dentro del chat |
| **XSS-safe Markdown** | Renderizado seguro con escape de HTML |
| **Retry automático** | Reintenta hasta 3 veces ante fallas de conexión |
| **Exportar conversación** | Botón 📥 para descargar el historial |
| **Limpiar historial** | Botón 🗑️ para reiniciar la conversación |
| **Marco legal integrado** | Conoce la Ley 26.639, Ley 24.585 y Resolución 142/2024 |

### Preguntas sugeridas

Al abrir el chatbot, aparecen **8 sugerencias** clickeables:

| Módulo | Pregunta de ejemplo |
|--------|---------------------|
| Glaciares | 🏔️ *¿Qué glaciares en San Juan están cerca de minería?* |
| Litio | ⚗️ *¿Cuántos proyectos de litio están en producción?* |
| Superficie | 📊 *¿Qué provincia tiene más superficie glaciar?* |
| ESG | 💰 *¿Cuántas regalías paga Veladero a San Juan?* |
| Cuencas | 💧 *¿Qué glaciares alimentan el Río Mendoza?* |
| Conflicto | ⚠️ *¿Dónde hay mayor conflicto minería-glaciares?* |
| Proyecciones | 🔋 *¿Cuánto litio va a producir Argentina en 2030?* |
| Proveedores | 🏭 *¿Qué proveedores locales hay en Jujuy?* |

### Motor de IA

ColossusAI está potenciado por **Google Gemini 2.5 Flash** a través de una API serverless en Vercel (`api/chat.js`). El prompt del sistema incluye las 6 bases de datos del dashboard como contexto completo, con más de 10 secciones de datos:

1. Base de glaciares completa (ING)
2. Proyectos mineros completos (SIACAM)
3. Módulo Litio especializado
4. ESG — Indicadores de sostenibilidad con datos fiscales y ambientales
5. Cadena de suministros CAPMIN
6. Análisis de proximidad espacial pre-calculado
7. Cuencas hidrográficas
8. Marco legal argentino
9. Métricas derivadas pre-calculadas
10. Ranking provincial por superficie glaciar

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
- Proyección: **120 kt LCE en 2025 → 500 kt en 2030 → 700 kt en 2035**
- Triángulo del Litio (Argentina, Chile, Bolivia): **56% de reservas mundiales**

---

### 📊 ESG — Indicadores de Sostenibilidad (SIACAM 2023 / EITI / TSM / SIPA)

**KPIs nacionales:**

| Indicador | Dato |
|-----------|------|
| Pagos fiscales (18 empresas, 2023) | ~USD 637 millones/año |
| Regalías provinciales (sector minero) | ~USD 210 millones/año |
| Inversiones anunciadas (dic-2019 – actual) | USD 23.100 millones |
| Empleo directo formal (SIPA) | ~27.500 trabajadores |
| Participación de mujeres | ~11% del sector |
| Proyectos adhiriendo al programa TSM | 28 |

**Tabla por proyecto (18 operaciones principales):**

Cada fila incluye 9 indicadores:

| Columna | Fuente |
|---------|--------|
| Proyecto (nombre, provincia, mineral) | SIACAM |
| Impuestos 2023 (USD M) | SIACAM |
| Regalías 2023 (USD M) | SIACAM / EITI |
| Consumo de agua (m³) | SIACAM |
| Consumo de energía (MWh) | SIACAM |
| Emisiones GEI (tCO₂e) | SIACAM |
| Empleo directo | SIACAM / SIPA |
| Porcentaje de mujeres | SIACAM |
| Status TSM | CAEM |

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

## Seguridad

La aplicación implementa múltiples capas de seguridad:

| Header / Política | Valor |
|--------------------|-------|
| **Content-Security-Policy** | Whitelist estricta de dominios para scripts, estilos, imágenes y conexiones |
| **X-Frame-Options** | `DENY` — ningún sitio puede embeber el dashboard en un iframe |
| **X-Content-Type-Options** | `nosniff` — previene MIME type sniffing |
| **Referrer-Policy** | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | Cámara, micrófono y geolocalización deshabilitados |
| **CORS en la API** | Solo acepta peticiones de dominios autorizados |
| **XSS en el chat** | Escape de HTML en todas las entradas del usuario (chat.js v3.0) |

---

## Despliegue y hosting

| Aspecto | Detalle |
|---------|---------|
| **Plataforma** | Vercel |
| **Tipo** | Static site + 1 Serverless Function |
| **Dominio** | dashboardmineria.vercel.app |
| **CORS** | Dominios permitidos: leydeglaciares.tech |
| **Caché HTML** | `max-age=0, must-revalidate` (siempre fresco) |
| **Analytics** | Vercel Web Analytics integrado |
| **Environment vars** | `GEMINI_API_KEY` (server-side, no expuesta al cliente) |

---

## Fuentes de datos oficiales

| Dato | Fuente |
|------|--------|
| Glaciares (ING 2018) | IANIGLA / CONICET |
| Actualización NOA (2024) | Resolución 142/2024 — Secretaría de Minería |
| Proyectos mineros | SIACAM — datos.gob.ar |
| Litio (capacidad, reservas) | USGS / Benchmark Mineral Intelligence |
| ESG / Pagos fiscales | SIACAM 2023 / EITI Argentina |
| Regalías | EITI Argentina — 4to Informe (FY 2022/23) |
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

**¿ColossusAI puede generar gráficos?**
Sí. Cuando la respuesta incluye datos comparativos (3+ items numéricos), el chatbot genera automáticamente gráficos interactivos (barras, torta, donut) dentro de la conversación.

---

> [!NOTE]
> Esta guía fue generada a partir del análisis completo del código fuente, estructura de datos y funcionalidad de la plataforma.

---

*© 2026 [ColossusLab.tech](https://colossuslab.tech) — Todos los derechos reservados*
