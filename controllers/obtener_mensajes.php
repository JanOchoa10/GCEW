<?php
session_start();
include_once '../models/api.php';

if (isset($_POST['btnMensajes'])) {
    // Obtener los valores de los parámetros de la consulta
    $idChat = $_POST['idChat'];

    // $usuarioActual = $_SESSION["id_logeado"];

    $mensajeClase = new Mensaje();

    // Llamar a la función obtenerMensajes() con los nuevos valores
    $misMensajesJSON = $mensajeClase->obtenerMensajesChat($idChat);

    // Devolver los resultados en formato JSON
    echo $misMensajesJSON;
}
