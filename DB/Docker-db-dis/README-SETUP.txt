Para setear la base de datos ejecute el comando en donde se ubica el dockerfile

	docker build -t "disp.data.uni:cassandra-db" .


La imagen del docker se creara con el tag de 'disp.data.uni'

obtenga el id de la imagen con el comando "docker images"

luego ejecute la imagen con el comando

	docker images
	
	docker run -p 9043:9042 -d  --name disp_kasa_db -it <id de la imagen>


ahora la imagen debera de aparecer en el desktop de docker lista para ejecutar el siguiente comando: 

	cqlsh -f /docker-entrypoint-initdb.d/uni_dispositivos.cql 