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

    $chatClase = new Chat();

    $miChatJSON = $chatClase->obtenerChats();
    $chatDecode = json_decode($miChatJSON)->Chats;

    // A partir de sus uid obtenemos sus id de la base de datos
    $miUsuarioJSON = $usuarioClase->obtenerUsuarios();
    $usuarioDecode = json_decode($miUsuarioJSON)->Usuarios;


    $idCreadorInt = 0;
    $idAContactarInt = 0;

    foreach ($usuarioDecode as $usuarioD) {
        if ($idCreador == $usuarioD->uid) {
            $idCreadorInt = $usuarioD->id_usuario;
            break;
        }
    }

    foreach ($usuarioDecode as $usuarioD) {
        if ($idAContactar == $usuarioD->uid) {
            $idAContactarInt = $usuarioD->id_usuario;
            break;
        }
    }


    $existeChat = false;

    foreach ($chatDecode as $chatD) {
        if (
            $idCreadorInt == $chatD->id_usuario_creador && $idAContactarInt == $chatD->id_usuario_receptor
            || $idCreadorInt == $chatD->id_usuario_receptor && $idAContactarInt == $chatD->id_usuario_creador
        ) {
            $existeChat = true;
            break;
        }
    }


    if (!$existeChat) {
        $res3 = $chatClase->altaChat($idCreadorInt, $idAContactarInt);

        if (!$res3) {
            echo 'Error al crear el chat';
            exit;
        }
    }

    echo 1;
}
