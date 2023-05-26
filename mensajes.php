<?php
// session_start();
include_once('models/api.php');

// if (!empty($_SESSION)) {
//     // header('Location: user-page');
//     $usuarios = new Usuario();
//     $usuarioLogeado = $usuarios->obtenerUnUsuario($_SESSION["id_logeado"]);
//     $tipoDeUsuarioUL = json_decode($usuarioLogeado)->Usuarios[0]->TipoDeUsuario;

//     if ($tipoDeUsuarioUL == 'Estudiante') {
//         // header('Location: user-page');
//     } else if ($tipoDeUsuarioUL == 'Profesor') {
//         // header('Location: profesor-dashboard');
//     } else if ($tipoDeUsuarioUL == 'Administrador') {
//         header('Location: admin-dashboard');
//     }
// } else {
//     header('Location: index');
// }

// $idChat = isset($_POST['idChat']) ? $_POST['idChat'] : 0;

// $UCUS = new Usuario_Contacta_Usuario();
// $misUCUsJSON = $UCUS->obtenerUCUsPorChats();
// $UCUsDecode = json_decode($misUCUsJSON)->UCUS;

// $usuarioClase = new Usuario();
// $usuarioActual = $_SESSION["id_logeado"];

// $mensajeClase = new Mensaje();
// $misMensajesJSON = $mensajeClase->obtenerMensajes();
// $mensajesDecode = json_decode($misMensajesJSON)->Mensajes;

// $usuarioJSON = $usuarioClase->obtenerUnUsuario($usuarioActual);
// $usuarioDecode = json_decode($usuarioJSON)->Usuarios;
// foreach ($usuarioDecode as $usuarioD) {
//     $fotoPerfilActual = $usuarioD->Imagen;
//     break;
// }
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat</title>
    <!-- <link rel="stylesheet" href="css/mensajes.css"> -->
    <link rel="stylesheet" href="css/curso_preview.css">
    <link rel="shortcut icon" type="x-icon" href="images/icon.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <link href="https://fonts.googleapis.com/css2?family=Fjalla+One&family=Poppins:wght@300;500;600&display=swap" rel="stylesheet">
    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/animate.css"> -->
    <link rel="stylesheet" href="css/animate.min.css">

    <link rel="stylesheet" href="css/chat.css">
</head>

<body style="font-family: Poppins, sans-serif;">
    <div class="container">
        <div class="row">
           
        </div>
    </div>

    <script src="js/crear-chat.js"></script>
    <script src="js/bs-init-chat.js"></script>
</body>

</html>