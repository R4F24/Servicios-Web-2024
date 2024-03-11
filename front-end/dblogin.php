<?php
    $conn = mysqli_connect(
        'localhost',
        'root',
        '',
        'pluge'
    );

    $query = "SELECT * FROM administradores";  
    $result = mysqli_query($conn, $query);  
        if (mysqli_num_rows($result) > 0) {  
        while ($row = mysqli_fetch_assoc($result)) {  
  }
}

if(isset($conn)){
    echo "<script> console.log('Conectado a DB'); </script>";
}else{
    echo "<script> console.log('Sin conexión a DB'); </script>";
}
?>