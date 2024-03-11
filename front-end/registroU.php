<!DOCTYPE html>
<html>
<head>
	<title>Registrar usuario</title>
	<meta charset="utf-8">
	<link rel="stylesheet" type="text/css" href="styles/registro.css">
</head>
<body>
    <form method="post">
    	<h1>Registro de usuario</h1>
    	<input type="text" name="nombre" placeholder="Nombre completo">
    	<input type="password" name="clave" placeholder="Contraseña">
    	<input type="submit" value="Registrarse" name="register">
        <a href="login.php"> Volver </a>
    </form>
    <?php 
        include("dbReg.php");
    ?>
</body>
</html>