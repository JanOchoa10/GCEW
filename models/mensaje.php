<?php

class Mensaje
{

    private $mensajes;

    private $idMensaje;
    private $id_chat;
    private $mensaje;
    private $idUsuarioCreador;
    private $idUsuarioReceptor;
    private $fechaCreacion;
    private $fechaCambio;
    private $activo;

    public function setIdMensaje($idMensaje)
    {
        $this->idMensaje = $idMensaje;
    }

    public function getIdMensaje()
    {
        return $this->idMensaje;
    }

    public function setid_chat($id_chat)
    {
        $this->id_chat = $id_chat;
    }

    public function getid_chat()
    {
        return $this->id_chat;
    }

    public function setMensaje($mensaje)
    {
        $this->mensaje = $mensaje;
    }

    public function getMensaje()
    {
        return $this->mensaje;
    }

    public function setIdUsuarioCreador($idUsuarioCreador)
    {
        $this->idUsuarioCreador = $idUsuarioCreador;
    }

    public function getIdUsuarioCreador()
    {
        return $this->idUsuarioCreador;
    }

    public function setIdUsuarioReceptor($idUsuarioReceptor)
    {
        $this->idUsuarioReceptor = $idUsuarioReceptor;
    }

    public function getIdUsuarioReceptor()
    {
        return $this->idUsuarioReceptor;
    }

    public function setFechaCreacion($fechaCreacion)
    {
        $this->fechaCreacion = $fechaCreacion;
    }

    public function getFechaCreacion()
    {
        return $this->fechaCreacion;
    }

    public function setFechaCambio($fechaCambio)
    {
        $this->fechaCambio = $fechaCambio;
    }

    public function getFechaCambio()
    {
        return $this->fechaCambio;
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
        $this->mensajes = new Consulta();
    }

    public function obtenerMensajes()
    {
        try {
            $arrMensajes = array();
            $arrMensajes["Mensajes"] = array();

            $res = $this->mensajes->getMensajes();

            if ($res && $res->rowCount() > 0) {
                while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                    $this->setIdMensaje($row['id_mensaje']);
                    $this->setid_chat($row['id_chat']);
                    $this->setMensaje($row['texto']);
                    $this->setIdUsuarioCreador($row['id_usuario_creador']);
                    $this->setIdUsuarioReceptor($row['id_usuario_receptor']);
                    $this->setFechaCreacion($row['fecha_creacion']);
                    $this->setFechaCambio($row['fecha_cambio']);
                    $this->setActivo($row['activo']);

                    $obj = array(
                        "id_mensaje" => $this->getIdMensaje(),
                        "id_chat" => $this->getid_chat(),
                        "texto" => $this->getMensaje(),
                        "id_usuario_creador" => $this->getIdUsuarioCreador(),
                        "id_usuario_receptor" => $this->getIdUsuarioReceptor(),
                        "fecha_creacion" => $this->getFechaCreacion(),
                        "fecha_cambio" => $this->getFechaCambio(),
                        "activo" => $this->getActivo()
                    );
                    array_push($arrMensajes["Mensajes"], $obj);
                }
                return json_encode($arrMensajes);
            } else {
                return json_encode($arrMensajes);
                throw new Exception('No hay elementos');
            }
        } catch (Exception $e) {
            throw new Exception('Error al obtener las mensajes');
        }
    }

    public function obtenerMensajesChat($idChat)
    {
        try {
            $arrMensajes = array();
            $arrMensajes["Mensajes"] = array();

            $res = $this->mensajes->getMensajesChat($idChat);

            if ($res && $res->rowCount() > 0) {
                while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                    $this->setIdMensaje($row['id_mensaje']);
                    $this->setid_chat($row['id_chat']);
                    $this->setMensaje($row['texto']);
                    $this->setIdUsuarioCreador($row['id_usuario_creador']);
                    $this->setIdUsuarioReceptor($row['id_usuario_receptor']);
                    $this->setFechaCreacion($row['fecha_creacion']);
                    $this->setFechaCambio($row['fecha_cambio']);
                    $this->setActivo($row['activo']);

                    $obj = array(
                        "id_mensaje" => $this->getIdMensaje(),
                        "id_chat" => $this->getid_chat(),
                        "texto" => $this->getMensaje(),
                        "id_usuario_creador" => $this->getIdUsuarioCreador(),
                        "id_usuario_receptor" => $this->getIdUsuarioReceptor(),
                        "fecha_creacion" => $this->getFechaCreacion(),
                        "fecha_cambio" => $this->getFechaCambio(),
                        "activo" => $this->getActivo()
                    );
                    array_push($arrMensajes["Mensajes"], $obj);
                }
                return json_encode($arrMensajes);
            } else {
                return json_encode($arrMensajes);
                throw new Exception('No hay elementos');
            }
        } catch (Exception $e) {
            throw new Exception('Error al obtener las mensajes');
        }
    }

    public function obtenerUnaMensaje($ID_Mensaje)
    {
        try {
            $arrMensajes = array();
            $arrMensajes["Mensajes"] = array();

            $res = $this->mensajes->getUnMensaje($ID_Mensaje);

            if ($res && $res->rowCount() > 0) {
                while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                    $this->setIdMensaje($row['id_mensaje']);
                    $this->setid_chat($row['id_chat']);
                    $this->setMensaje($row['texto']);
                    $this->setIdUsuarioCreador($row['id_usuario_creador']);
                    $this->setIdUsuarioReceptor($row['id_usuario_receptor']);
                    $this->setFechaCreacion($row['fecha_creacion']);
                    $this->setFechaCambio($row['fecha_cambio']);
                    $this->setActivo($row['activo']);

                    $obj = array(
                        "id_mensaje" => $this->getIdMensaje(),
                        "id_chat" => $this->getid_chat(),
                        "texto" => $this->getMensaje(),
                        "id_usuario_creador" => $this->getIdUsuarioCreador(),
                        "id_usuario_receptor" => $this->getIdUsuarioReceptor(),
                        "fecha_creacion" => $this->getFechaCreacion(),
                        "fecha_cambio" => $this->getFechaCambio(),
                        "activo" => $this->getActivo()
                    );
                    array_push($arrMensajes["Mensajes"], $obj);
                }
                return json_encode($arrMensajes);
            } else {
                return json_encode($arrMensajes);
                throw new Exception('No se encontró ningún mensaje con el ID proporcionado');
            }
        } catch (Exception $e) {
            throw new Exception('Error: No se encontró ningún mensaje con el ID proporcionado');
        }
    }

    public function altaMensaje(
        $id_chat,
        $texto,
        $id_usuario_creador,
        $id_usuario_receptor
    ) {

        try {
            $res = $this->mensajes->setMensaje(
                $id_chat,
                $texto,
                $id_usuario_creador,
                $id_usuario_receptor
            );

            return $res;
        } catch (Exception $e) {
            throw new Exception('Error al dar de alta el mensaje');
        }
    }
}
