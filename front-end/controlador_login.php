<?php
session_start();

include("dblogin.php");

    if(!empty($_POST["btningresar"])){
       if(!empty($_POST["usuario"]) and !empty($_POST["password"])){
            $usuario = $_POST["usuario"];
            $password = $_POST["password"];
            $sql = $conn-> query("SELECT * FROM administradores WHERE username = '$usuario' and clave = '$password'");
            if ($datos = $sql -> fetch_object()) {
                $_SESSION["id"] = $datos -> id;
                $_SESSION["id"] = $datos -> username;
               // header("location: plug_energy.php");              
            } else {
                echo "<div class='alert alert-danger' role='alert'> Acceso denegado </div>";
            }
            
       } else {

        echo "Campos vacios";

       }
    }

