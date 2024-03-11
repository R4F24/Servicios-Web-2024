<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
   <link rel="stylesheet"  type="text/css" href="styles/login.css">
   <title> Inicio de sesión </title>
</head>
<body>
   <div class="container">
      </div>
      <div class="login-content">
         <form method="post" action="">
            <h2 class="title"> Personal Autorizado </h2>
            <?php
            include ("controlador_login.php");
            ?>
            <div class="input-div one">
               <div class="i">
                  <i class="fas fa-user"></i>
               </div>
               <div class="div">
                  <input id="usuario" type="text" class="input" name="usuario" placeholder="Usuario">
               </div>
            </div>
            <div class="input-div pass">
               <div class="i">
                  <i class="fas fa-lock"></i>
               </div>
               <div class="div">
                  <input type="password" id="input" class="input" name="password" placeholder="Contraseña">
               </div>
            </div>
            <div class="view">
               <div class="fas fa-eye verPassword" onclick="vista()" id="verPassword"></div>
            </div>
            <div class="text-center">
               <a class="font-italic isai5" href="registroU.php">Registrarse</a>
            </div>
            <input name="btningresar" class="btn" type="submit" value="INICIAR SESION">
            <a href="plug_energy.php"> Volver a Inicio </a>
         </form>
      </div>
   </div>
</body>
</html>