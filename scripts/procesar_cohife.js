const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// The single Shapefile downloaded from COHIFE
const inputPath = 'C:\\Users\\dante\\Downloads\\cuencas-hdricas-cohife\\cuencas-hÒdricas-cohife-shp.shp';
const outFile = path.join(__dirname, '../data/cuencas.geojson');

console.log("=========================================================================");
console.log(" PROCESADOR DE CUENCAS HÍDRICAS (COHIFE / IGN) - SIMPLIFICACIÓN AL 1% ");
console.log("=========================================================================");

if (!fs.existsSync(inputPath)) {
    console.error(`\n❌ ERROR CRÍTICO: No se encontró el archivo Shapefile en la ruta:`);
    console.error(`   ${inputPath}`);
    console.log(`\nPor favor, verifica que el archivo haya sido extraído ahí.`);
    process.exit(1);
}

console.log(`\n1. Archivo de origen detectado correctamente:`);
console.log(`   -> ${inputPath}`);

console.log("\n2. Ejecutando Mapshaper para reproyectar y simplificar la geometría (Compresión 1%)...");
console.log("   -> Convirtiendo mapa gigante a GeoJSON ultraligero para la Web (WGS84)...");

// Using npx mapshaper
// -proj wgs84: forces Lat/Lng which Leaflet expects
// -simplify dp 1%: reduces original 83MB to a tiny web-friendly vector file
const commandGeojson = `npx --yes mapshaper -i "${inputPath}" -simplify dp 1% -proj wgs84 -o "${outFile}" format=geojson`;

try {
    // We execute it from the user's workspace
    execSync(commandGeojson, { stdio: 'inherit', cwd: path.join(__dirname, '../') });
    console.log(`\n   -> ¡Sublime! Archivo final generado exitosamente en: data/cuencas.geojson`);
} catch (e) {
    console.error("\n❌ Error crítico al ejecutar mapshaper:", e.message);
    process.exit(1);
}

try {
    const finalStats = fs.statSync(outFile);
    console.log(`\nPROCESO TERMINADO. El archivo GeoJSON optimizado final pesa: ${(finalStats.size / (1024 * 1024)).toFixed(2)} MB`);
    console.log("Listo para implementarse asíncronamente en el Frontend (js/app.js).");
} catch(e) {
    console.log("\nNo se pudo consultar el peso del archivo final.");
}
