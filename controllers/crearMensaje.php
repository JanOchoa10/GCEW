<?php
session_start();
include_once '../models/api.php';

if (isset($_POST['btnCrearMensaje'])) {

    $idUsuarioCreador = $_POST["idCreador"];
    $idReceptor = $_POST["idReceptor"];
    $idChat = $_POST["idChat"];
    $mensajeChat = $_POST["mensajeChat"];


    $claseMensaje = new Mensaje();
    // $misMensajesJSON = $claseMensaje->obtenerMensajesChat($idChat);
    $res = $claseMensaje->altaMensaje($idChat, $mensajeChat, $idUsuarioCreador, $idReceptor);

    if (!$res) {
        echo 'No se envió el mensaje';
        exit();
    }


    echo 1;
}
