# Visor del Arbolado Urbano en Bogotá
Visor para el acercamiento de la ciudadanía a las especies, cantidades, espacialización y cuidado del arbolado urbano en Bogotá
# Pipeline básico!
1. Limpieza de Datos
	- Nombre de las Localidades
	- Nombre especie del árbol
	- Eliminación Columnas innecesarias
	- Agregar columna "tree-code" (identificador numérico para la especie del árbol)
2. Conversión del CSV a GeoJSON
```sh
$ csvjson --lat lat --lon lon --crs EPSG:4269 --indent 4 arbolado-bogota-codes.csv > arbolado-bogota-codes.json
```
3. Conversión dle GeoJSON gigante a tiles

   **Fuente**: https://github.com/GISupportICRC/ArcGIS2Mapbox#installing-tippecanoe-on-windows
```sh
$ tippecanoe -o arbolado-bog.mbtiles arbolado-bogota-codes.json    arbolado-bogota-codes.json
```
4. Generación Mapa
