<?php

class Usuario
{

    private $usuarios;

    private $id_usuario;
    private $uid;
    private $nombre;
    private $imagen;
    private $email;
    private $fecha_registro;
    private $fecha_cambio;
    private $activo;

    public function setIdUsuario($id_usuario)
    {
        $this->id_usuario = $id_usuario;
    }

    public function getIdUsuario()
    {
        return $this->id_usuario;
    }

    public function setUid($uid)
    {
        $this->uid = $uid;
    }

    public function getUid()
    {
        return $this->uid;
    }

    public function setNombre($nombre)
    {
        $this->nombre = $nombre;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    public function setImagen($imagen)
    {
        $this->imagen = $imagen;
    }

    public function getImagen()
    {
        return $this->imagen;
    }

    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function setFechaRegistro($fecha_registro)
    {
        $this->fecha_registro = $fecha_registro;
    }

    public function getFechaRegistro()
    {
        return $this->fecha_registro;
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
        $this->usuarios = new Consulta();
    }



    public function obtenerUsuarios()
    {
        try {
            $arrUsuarios = array();
            $arrUsuarios["Usuarios"] = array();

            $res = $this->usuarios->getUsuarios();

            if ($res && $res->rowCount() > 0) {
                while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                    $this->setIdUsuario($row['id_usuario']);
                    $this->setUid($row['uid']);
                    $this->setNombre($row['nombre']);
                    $this->setImagen($row['imagen']);
                    $this->setEmail($row['email']);
                    $this->setFechaRegistro($row['fecha_registro']);
                    $this->setFechaCambio($row['fecha_cambio']);
                    $this->setActivo($row['activo']);

                    $obj = array(
                        "id_usuario" => $this->getIdUsuario(),
                        "uid" => $this->getUid(),
                        "nombre" => $this->getNombre(),
                        "imagen" => $this->getImagen(),
                        "email" => $this->getEmail(),
                        "fecha_registro" => $this->getFechaRegistro(),
                        "fecha_cambio" => $this->getFechaCambio(),
                        "activo" => $this->getActivo()
                    );
                    array_push($arrUsuarios["Usuarios"], $obj);
                }
                return json_encode($arrUsuarios);
            } else {
                return json_encode($arrUsuarios);
                throw new Exception('No se encontró ningún usuario con el ID proporcionado');
            }
        } catch (Exception $e) {
            throw new Exception('Error: No se encontró ningún usuario con el ID proporcionado');
        }
    }
    
    public function obtenerUnUsuario($id_usuario)
    {
        try {
            $arrUsuarios = array();
            $arrUsuarios["Usuarios"] = array();

            $res = $this->usuarios->getUnUsuario($id_usuario);

            if ($res && $res->rowCount() > 0) {
                while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
                    $this->setIdUsuario($row['id_usuario']);
                    $this->setUid($row['uid']);
                    $this->setNombre($row['nombre']);
                    $this->setImagen($row['imagen']);
                    $this->setEmail($row['email']);
                    $this->setFechaRegistro($row['fecha_registro']);
                    $this->setFechaCambio($row['fecha_cambio']);
                    $this->setActivo($row['activo']);

                    $obj = array(
                        "id_usuario" => $this->getIdUsuario(),
                        "uid" => $this->getUid(),
                        "nombre" => $this->getNombre(),
                        "imagen" => $this->getImagen(),
                        "email" => $this->getEmail(),
                        "fecha_registro" => $this->getFechaRegistro(),
                        "fecha_cambio" => $this->getFechaCambio(),
                        "activo" => $this->getActivo()
                    );
                    array_push($arrUsuarios["Usuarios"], $obj);
                }
                return json_encode($arrUsuarios);
            } else {
                return json_encode($arrUsuarios);
                throw new Exception('No se encontró ningún usuario con el ID proporcionado');
            }
        } catch (Exception $e) {
            throw new Exception('Error: No se encontró ningún usuario con el ID proporcionado');
        }
    }

    public function altaUsuario(
        $uid,
        $nombre,
        $imagen,
        $email
    ) {

        try {
            $res = $this->usuarios->setUsuario(
                $uid,
                $nombre,
                $imagen,
                $email
            );

            return $res;
        } catch (Exception $e) {
            throw new Exception('Error al dar de alta el usuario');
        }
    }
}
