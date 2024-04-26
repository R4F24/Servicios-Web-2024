Para setear la base de datos ejecute el comando en donde se ubica el dockerfile

	docker build -t "meter.data.uni:cassandra-db" .

La imagen del docker se creara con el tag de 'meter.data.uni'

obtenga el id de la imagen con el comando "docker images"

luego ejecute la imagen con el comando

	docker images
	
	docker run -p 9041:9042  -d --name kasa_meter_db -it <id de la imagen>
	

ahora la imagen debera de aparecer en el desktop de docker lista para ejecutar el siguiente comando: 


	cqlsh -f /docker-entrypoint-initdb.d/meter_historial.cql 