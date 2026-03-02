# 🏔️ Glaciares & Minería — Dashboard Argentina

> **Dashboard interactivo para el análisis espacial de glaciares y proyectos mineros en la República Argentina**

[![Powered by ColossusLab.tech](https://img.shields.io/badge/Powered%20by-ColossusLab.tech-00d4ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDEyTDEyIDIyTDIwIDEyTDEyIDJaIiBmaWxsPSIjMDBkNGZmIi8+PC9zdmc+)](https://colossuslab.tech)

---

## 📋 Descripción

Este dashboard integra datos del **Inventario Nacional de Glaciares (ING)** y la **Cartera de Proyectos Mineros SIACAM** (datos.gob.ar) para visualizar y analizar la relación geográfica entre áreas glaciares y actividad minera en Argentina.

### Datos incluidos

| Fuente | Registros | Descripción |
|--------|-----------|-------------|
| **ING 2018** | 16,968 geoformas (150+ puntos representativos) | Glaciares y ambientes periglaciales en 12 provincias |
| **SIACAM** | 82 proyectos | Proyectos mineros con ubicación, mineral, empresa y etapa |

---

## ✨ Funcionalidades

### 🗺️ Mapa Interactivo
- Base cartográfica dark (CartoDB) con overlay del IGN
- Marcadores diferenciados: glaciares (cyan), periglaciales (violeta), minería (diamantes por mineral)
- Click en provincia → zoom automático + filtrado + barra informativa

### 🔍 Filtros Dinámicos
- **Provincia**: 12 provincias con presencia glaciar
- **Tipo de glaciar**: Glaciar / Ambiente Periglacial
- **Superficie mínima**: Slider configurable (km²)
- **Minerales**: Cobre, Oro, Plata, Litio, Uranio, Potasio, Hierro, Plomo, Carbón
- **Etapa del proyecto**: Producción, Construcción, Factibilidad, Prefactibilidad, Exploración, Evaluación
- **Radio de proximidad**: 10 / 25 / 50 / 100 km

### 📊 Análisis Espacial
- Distancia Haversine entre cada proyecto minero y glaciar más cercano
- Detección de proximidad con clasificación de riesgo (critical / high / medium / low)
- Círculos de alerta y líneas de conexión al glaciar más cercano
- Ranking de minerales predominantes en zonas glaciares

### 📈 Métricas y Gráficos
- 6 tarjetas métricas clave
- 8 gráficos interactivos en 3 pestañas (Resumen, Análisis, Minerales)
- Actualización dinámica según filtros aplicados

---

## 🚀 Deploy

### Desarrollo local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/dashboard-glaciares-mineria.git

# Servir localmente (cualquier servidor estático)
npx serve .
```

### Producción (Vercel)

1. Importar el repo en [vercel.com](https://vercel.com)
2. Framework Preset: **Other** (sitio estático)
3. Click en **Deploy**

No requiere build ni configuración adicional.

---

## 🛠️ Stack Técnico

| Tecnología | Uso |
|------------|-----|
| **HTML5 / CSS3 / JS** | Aplicación 100% client-side |
| **Leaflet.js** | Mapa interactivo |
| **Chart.js** | Gráficos y visualizaciones |
| **CartoDB Dark** | Tiles base del mapa |
| **IGN WMS** | Overlay de provincias argentinas |

---

## 📁 Estructura del Proyecto

```
Dashboard mineria/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Tema dark premium con glassmorphism
├── js/
│   ├── app.js              # Inicialización del mapa y bindings
│   ├── analysis.js         # Motor de análisis espacial
│   ├── charts.js           # 8 tipos de gráficos (Chart.js)
│   └── filters.js          # Sistema reactivo de filtros
└── data/
    ├── glaciares.js         # Dataset de glaciares (ING 2018)
    ├── mineria.js           # Proyectos mineros (SIACAM)
    └── provincias.js        # GeoJSON de provincias
```

---

## 📊 Fuentes de Datos

- **Inventario Nacional de Glaciares (ING)** — [glaciaresargentinos.gob.ar](https://www.glaciaresargentinos.gob.ar) — Datos publicados 2018
- **Cartera de Proyectos Mineros SIACAM** — [datos.gob.ar](https://datos.gob.ar) — Ubicación aproximada de proyectos mineros
- **Instituto Geográfico Nacional (IGN)** — [wms.ign.gob.ar](https://wms.ign.gob.ar) — Servicio WMS de capas geográficas

---

## 📄 Licencia

Este proyecto utiliza datos públicos del Estado argentino publicados bajo licencias abiertas. El código fuente es de uso libre.

---

<p align="center">
  <strong>Powered by <a href="https://colossuslab.tech">ColossusLab.tech</a></strong><br>
  <sub>Data Intelligence & Spatial Analysis</sub>
</p>
