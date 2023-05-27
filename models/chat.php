<?php

class Chat
{

    private $chats;

    private $id_chat;
    private $id_usuario_creador;
    private $id_usuario_receptor;
    private $fecha_creacion;
    private $fecha_cambio;
    private $activo;

    public function setIdChat($id_chat)
    {
        $this->id_chat = $id_chat;
    }

    public function getIdChat()
    {
        return $this->id_chat;
    }

    public function setIdUsuarioCreador($id_usuario_creador)
    {
        $this->id_usuario_creador = $id_usuario_creador;
    }

    public function getIdUsuarioCreador()
    {
        return $this->id_usuario_creador;
    }

    public function setIdUsuarioReceptor($id_usuario_receptor)
    {
        $this->id_usuario_receptor = $id_usuario_receptor;
    }

    public function getIdUsuarioReceptor()
    {
        return $this->id_usuario_receptor;
    }

    public function setFechaCreacion($fecha_creacion)
    {
        $this->fecha_creacion = $fecha_creacion;
    }

    public function getFechaCreacion()
    {
        return $this->fecha_creacion;
    }

    public function setFechaCambio($fecha_cambio)
    {
        $this->fecha_cambio = $fecha_cambio;
    }

    public function getFechaCambio()
    {
        return $this->fecha_cambio;
    }

    public function setActivo($activo)
    {
        $this->activo = $activo;
    }

    public function getActivo()
    {
        return $this->activo;
    }

    public function __construct()
    {
        $this->chats = new Consulta();
    }



    public function obtenerChats()
    {
        try {
            $arrChats = array();
            $arrChats["Chats"] = array();

            $res = $this->chats->getChats();

            if ($res && $res->rowCount() > 0) {
                while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                    $this->setIdChat($row['id_chat']);
                    $this->setIdUsuarioCreador($row['id_usuario_creador']);
                    $this->setIdUsuarioReceptor($row['id_usuario_receptor']);
                    $this->setFechaCambio($row['fecha_creacion']);
                    $this->setFechaCambio($row['fecha_cambio']);
                    $this->setActivo($row['activo']);

                    $obj = array(
                        "id_chat" => $this->getIdChat(),
                        "id_usuario_creador" => $this->getIdUsuarioCreador(),
                        "id_usuario_receptor" => $this->getIdUsuarioReceptor(),
                        "fecha_creacion" => $this->getFechaCambio(),
                        "fecha_cambio" => $this->getFechaCambio(),
                        "activo" => $this->getActivo()
                    );
                    array_push($arrChats["Chats"], $obj);
                }
                return json_encode($arrChats);
            } else {
                return json_encode($arrChats);
                throw new Exception('No se encontró ningún chat con el ID proporcionado');
            }
        } catch (Exception $e) {
            throw new Exception('Error: No se encontró ningún chat con el ID proporcionado');
        }
    }

    public function obtenerUnChat($id_usuario_creador, $id_usuario_receptor)
    {
        try {
            $arrChats = array();
            $arrChats["Chats"] = array();

            $res = $this->chats->getUnChat($id_usuario_creador, $id_usuario_receptor);

            if ($res && $res->rowCount() > 0) {
                while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                    $this->setIdChat($row['id_chat']);
                    $this->setIdUsuarioCreador($row['id_usuario_creador']);
                    $this->setIdUsuarioReceptor($row['id_usuario_receptor']);
                    $this->setFechaCambio($row['fecha_creacion']);
                    $this->setFechaCambio($row['fecha_cambio']);
                    $this->setActivo($row['activo']);

                    $obj = array(
                        "id_chat" => $this->getIdChat(),
                        "id_usuario_creador" => $this->getIdUsuarioCreador(),
                        "id_usuario_receptor" => $this->getIdUsuarioReceptor(),
                        "fecha_creacion" => $this->getFechaCambio(),
                        "fecha_cambio" => $this->getFechaCambio(),
                        "activo" => $this->getActivo()
                    );
                    array_push($arrChats["Chats"], $obj);
                }
                return json_encode($arrChats);
            } else {
                return json_encode($arrChats);
                throw new Exception('No se encontró ningún chat con el ID proporcionado');
            }
        } catch (Exception $e) {
            throw new Exception('Error: No se encontró ningún chat con el ID proporcionado');
        }
    }

    public function altaChat(
        $id_usuario_creador, $id_usuario_receptor
    ) {

        try {
            $res = $this->chats->setChat(
                $id_usuario_creador, $id_usuario_receptor
            );

            return $res;
            
        } catch (Exception $e) {
            throw new Exception('Error al dar de alta el chat');
        }
    }
}
