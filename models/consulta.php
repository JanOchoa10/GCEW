<?php


include_once 'db.php';

class Consulta extends DB
{

    // Funciones para Usuario
    function getUsuarios()
    {
        $query = $this->connect()->query("CALL sp_usuario('S', NULL, NULL, NULL, NULL, NULL);");
        return $query;
    }

    function getUnUsuario($id_usuario)
    {
        $query = $this->connect()->query("CALL sp_usuario('O', NULL, '$id_usuario', NULL, NULL, NULL);");
        return $query;
    }

    function setUsuario(
        $uid,
        $nombre,
        $imagen,
        $email
    ) {

        $query = $this->connect()->query("CALL sp_usuario('I', NULL, '$uid', '$nombre', '$imagen', '$email');");
        return $query;
    }
}
