<?php
    include("dblogin.php");
   if(isset($_POST['register'])){
    if (strlen($_POST['nombre']) >= 1 && strlen($_POST['clave']) >= 1 ){
        $nombre = trim($_POST['nombre']);
        $clave = trim($_POST['clave']); 
        $fechareg = date("d/m/y");  
        $consulta = "INSERT INTO administradores(username, clave, fecha_reg) VALUES ('$nombre','$clave','$fechareg')";
        $result = mysqli_query($conn, $consulta);
        if($result){
            ?>
            <h3 class="ok"> Registrado satisfactoriamente </h3>
            <?php
        } else{
            ?>
            <h3 class="bad"> Error en registro </h3>
            <?php
        }
    } else {
        ?>
        <h3 class="bad"> Completar los campos </h3>
        <?php
    }
   }
?>