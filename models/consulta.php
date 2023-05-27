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

    // Funciones para Chat
    function getChats()
    {
        $query = $this->connect()->query("CALL sp_chat('S', NULL, NULL, NULL);");
        return $query;
    }

    function getUnChat($id_usuario_creador, $id_usuario_receptor)
    {
        $query = $this->connect()->query("CALL sp_chat('O', NULL, '$id_usuario_creador', '$id_usuario_receptor');");
        return $query;
    }

    function setChat(
        $id_usuario_creador,
        $id_usuario_receptor
    ) {

        $query = $this->connect()->query("CALL sp_chat('I', NULL, '$id_usuario_creador', '$id_usuario_receptor');");
        return $query;
    }

     // Funciones para Mensaje
     function getMensajes()
     {
         $query = $this->connect()->query("CALL sp_mensaje('S', NULL, NULL, NULL, NULL, NULL);");
         return $query;
     }
    
     function getMensajesChat($id_chat)
     {
         $query = $this->connect()->query("CALL sp_mensaje('C', NULL, '$id_chat', NULL, NULL, NULL);");
         return $query;
     }
 
     function getUnMensaje($id_mensaje)
     {
         $query = $this->connect()->query("CALL sp_mensaje('O', 'id_mensaje', NULL, NULL, NULL, NULL);");
         return $query;
     }
 
     function setMensaje(
         $id_chat,
         $texto,
         $id_usuario_creador,
         $id_usuario_receptor
     ) {
 
         $query = $this->connect()->query("CALL sp_mensaje('I', NULL, '$id_chat', '$texto', '$id_usuario_creador', '$id_usuario_receptor');");
         return $query;
     }
}
