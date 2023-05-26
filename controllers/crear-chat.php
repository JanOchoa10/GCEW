<?php
include_once '../models/api.php';

if (isset($_POST['btnCrearChat'])) {
    $idCreador = $_POST["idCreador"];
    $idAContactar = $_POST["idAContactar"];

    $nombreCreador = $_POST["nombreCreador"];
    $imagenCreador = $_POST["imagenCreador"];
    $emailCreador = $_POST["emailCreador"];

    $nombreAContactar = $_POST["nombreAContactar"];
    $imagenAContactar = $_POST["imagenAContactar"];
    $emailAContactar = $_POST["emailAContactar"];

    $usuarioClase = new Usuario();

    $miUsuarioJSON = $usuarioClase->obtenerUsuarios();
    $usuarioDecode = json_decode($miUsuarioJSON)->Usuarios;

    $existeUsuarioCreador = false;
    $existeUsuarioAContactar = false;

    foreach ($usuarioDecode as $usuarioD) {
        if ($idCreador == $usuarioD->uid) {
            $existeUsuarioCreador = true;
            break;
        }
    }
    foreach ($usuarioDecode as $usuarioD) {
        if ($idAContactar == $usuarioD->uid) {
            $existeUsuarioAContactar = true;
            break;
        }
    }


    if (!$existeUsuarioCreador) {
        $res = $usuarioClase->altaUsuario($idCreador, $nombreCreador, $imagenCreador, $emailCreador);

        if (!$res) {
            echo 'Error al crear el usuario creador';
            exit;
        }
    }
    if (!$existeUsuarioAContactar) {
        $res2 = $usuarioClase->altaUsuario($idAContactar, $nombreAContactar, $imagenAContactar, $emailAContactar);

        if (!$res2) {
            echo 'Error al crear el usuario a contactar';
            exit;
        }
    }



    // // Verificar si la consulta devuelve filas (es decir, el chat ya existe)
    // if ($resultadoCreador->num_rows > 0) {
    //     // El chat ya existe, realizar las acciones necesarias
    // } else {
    //     // El chat no existe, llamar al procedimiento almacenado para crearlo
    //     $crearUsuarioCreador = "CALL sp_usuario('I', NULL, '$idCreador', '$nombreCreador', '$imagenCreador', '$emailCreador');";
    //     if ($conn->query($crearUsuarioCreador) === TRUE) {
    //         // El chat se creó exitosamente
    //     } else {
    //         echo "Error al llamar al crearUsuarioCreador: " . $conn->error;
    //     }
    // }

    // // Liberar los resultados
    // $resultadoCreador->free();

    // // Consulta para verificar si existe un chat entre los usuarios
    // $verificarUsuarioAContactar = "CALL sp_usuario('O', NULL, '$idAContactar', NULL, NULL, NULL);";

    // // Ejecutar la consulta
    // $resultadoAContactar = $conn->query($verificarUsuarioAContactar);

    // // Verificar si la consulta devuelve filas (es decir, el chat ya existe)
    // if ($resultadoAContactar->num_rows > 0) {
    //     // El chat ya existe, realizar las acciones necesarias
    // } else {
    //     // El chat no existe, llamar al procedimiento almacenado para crearlo
    //     $crearUsuarioAContactar = "CALL sp_usuario('I', NULL, '$idAContactar', '$nombreAContactar', '$imagenAContactar', '$emailAContactar');";
    //     if ($conn->query($crearUsuarioAContactar) === TRUE) {
    //         // El chat se creó exitosamente
    //     } else {
    //         echo "Error al llamar al crearUsuarioAContactar: " . $conn->error;
    //     }
    // }

    // // Liberar los resultados
    // $resultadoAContactar->free();

    // // Consulta para verificar si existe un chat entre los usuarios
    // $verificarChat = "CALL sp_chat('O', NULL, '$idCreador', '$idAContactar');";

    // // Ejecutar la consulta
    // $resultado = $conn->query($verificarChat);

    // // Verificar si la consulta devuelve filas (es decir, el chat ya existe)
    // if ($resultado->num_rows > 0) {
    //     // El chat ya existe, realizar las acciones necesarias
    // } else {
    //     // El chat no existe, llamar al procedimiento almacenado para crearlo
    //     $crearChat = "CALL sp_chat('I', NULL, '$idCreador', '$idAContactar');";
    //     if ($conn->query($crearChat) === TRUE) {
    //         // El chat se creó exitosamente
    //     } else {
    //         echo "Error al llamar al crearChat: " . $conn->error;
    //     }
    // }

    // // Liberar los resultados
    // $resultado->free();

    // // Cerrar la conexión
    // $conn->close();


    echo 1;
}
