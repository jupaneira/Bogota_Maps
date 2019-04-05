1. LIMPIEZA DE DATOS
	NOMBRE DE LAS LOCALIDADES
	NOMBRE ESPECIE DE LOS ARBOLES
	ELIMINACION COLUMMNAS INNCECESARIAS
	Agregar columna "tree-code" (mapeo de nombre a número) - ipython notebook
2. CONVERTIR CSV A GEOJSON
	csvjson --lat lat --lon lon --crs EPSG:4269 --indent 4 arbolado-bogota-codes.csv > arbolado-bogota-codes.json
3. GEOJSON gigante, toca convertirlo a tiles
	https://github.com/GISupportICRC/ArcGIS2Mapbox#installing-tippecanoe-on-windows
	tippecanoe -o arbolado-bog.mbtiles arbolado-bogota-codes.json   
4. Mapita 