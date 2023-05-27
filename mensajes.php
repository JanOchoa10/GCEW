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

$idChat = isset($_POST['idChat']) ? $_POST['idChat'] : 0;

$claseChat = new Chat();
$miChatJSON = $claseChat->obtenerChats();
$chatsDecode = json_decode($miChatJSON)->Chats;

// echo '<script>console.log(' . json_encode($chatsDecode) . ')</script>';

// $usuarioClase = new Usuario();
$usuarioActual = $_GET["usuario"];

$usuarioActualInt = 0;

$usuarioClase = new Usuario();

$miUsuarioJSON = $usuarioClase->obtenerUsuarios();
$usuarioDecode = json_decode($miUsuarioJSON)->Usuarios;
// echo '<script>console.log(' . json_encode($usuarioDecode) . ');</script>';

foreach ($usuarioDecode as $usuarioD) {
    if ($usuarioActual == $usuarioD->uid) {
        $usuarioActualInt = $usuarioD->id_usuario;
        break;
    }
}
$uidTemp = $usuarioActual;
$usuarioActual = $usuarioActualInt;

$mensajeClase = new Mensaje();
$misMensajesJSON = $mensajeClase->obtenerMensajes();
$mensajesDecode = json_decode($misMensajesJSON)->Mensajes;

$usersJSON = $usuarioClase->obtenerUnUsuario($uidTemp);
$decodesUsers = json_decode($usersJSON)->Usuarios;
foreach ($decodesUsers as $usuarioD) {
    $fotoPerfilActual = $usuarioD->imagen;
    break;
}
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
            <div class="col-md-8 col-xl-4 col-xxl-4" id="contenedor-msj">
                <div class="msj-recibidos"><a class="btn-volver" href="puntuation.html?usuario=<?php echo $uidTemp; ?>"><i class="fas fa-arrow-left text-white" id="flecha-icon"></i></a>
                    <h3 id="hd-chats">Chats</h3>
                </div>
                <div id="lista-msj">
                    <?php

                    $hayChatEnEsteUsuario = false;
                    if (count($chatsDecode) > 0) {

                        foreach ($chatsDecode as $ucuD) {
                            if ($usuarioActual == $ucuD->id_usuario_creador || $usuarioActual == $ucuD->id_usuario_receptor) {
                                $usuarioABuscar = ($usuarioActual == $ucuD->id_usuario_receptor) ? $ucuD->id_usuario_creador : $ucuD->id_usuario_receptor;
                                echo '<script>console.log(' . json_encode($chatsDecode) . ');</script>';

                                foreach ($usuarioDecode as $usuarioD) {
                                    if ($usuarioABuscar == $usuarioD->id_usuario) {
                                        $usuarioABuscar = $usuarioD->uid;
                                        break;
                                    }
                                }

                                $usuarioJSON = $usuarioClase->obtenerUnUsuario($usuarioABuscar);
                                $usuarioDecode = json_decode($usuarioJSON)->Usuarios;
                                $hayChatEnEsteUsuario = true;
                                $ultimoMensaje = "";
                                $horaDelUltimoMensaje = "";
                                // foreach ($mensajesDecode as $mensajeD) {
                                //     if ($ucuD->id_chat == $mensajeD->id_chat) {
                                //         if ($usuarioActual == $mensajeD->id_usuario_creador) {
                                //             $preMensaje = 'Tú: ';
                                //         } elseif ($usuarioActual == $mensajeD->id_usuario_receptor) {
                                //             $preMensaje = '-> ';
                                //         }
                                //         $ultimoMensaje = $preMensaje . $mensajeD->Mensaje;
                                //         $fechaCreacion = new DateTime($mensajeD->FechaCreacion);
                                //         $fechaFormateada = $fechaCreacion->format('d-m-Y');
                                //         $horaFormateada = $fechaCreacion->format('h:i A');
                                //         // $horaDelUltimoMensaje = $fechaFormateada . " " . $horaFormateada;
                                //     }
                                // }

                                // echo '<script>console.log("Sí llega");</script>';
                                // echo '<script>console.log(' . json_encode($usuarioDecode) . ');</script>';
                                foreach ($usuarioDecode as $usuarioD) {
                                    echo '<script>console.log(' . json_encode($chatsDecode) . ');</script>';
                    ?>
                                    <!-- <form id="formularioIrAChat"> -->
                                    <button class="w-100 p-2 btnChat" type="submit" value="<?php echo $ucuD->id_chat; ?>">
                                        <div data-bss-hover-animate="pulse" class="msj-indiv">
                                            <img class="rounded-circle foto-lista" width="50" height="50" src="<?php echo $usuarioD->imagen; ?>">
                                            <?php if ($ultimoMensaje != "") { ?>
                                                <div class="d-flex limitar-tamano">
                                                    <div class="d-flex flex-column ms-3 col-7 justify-content-center">
                                                        <h1 class="nombre-lista2 h-auto w-100 m-0">
                                                            <?php
                                                            echo  $usuarioD->nombre;
                                                            ?>
                                                        </h1>
                                                        <span class="contenido-lista2 text-start"><?php echo $ultimoMensaje; ?></span>
                                                    </div>
                                                    <div class="d-flex flex-column col-5 me-2 justify-content-center">
                                                        <span class="text-end hora-lista2"><?php echo $fechaFormateada; ?></span>
                                                        <span class="text-end hora-lista2"><?php echo $horaFormateada; ?></span>
                                                    </div>
                                                </div>

                                            <?php } else { ?>
                                                <div class="d-flex w-100">
                                                    <div class="d-flex flex-column ms-3 col-7 justify-content-center">
                                                        <h1 class="nombre-lista2 h-auto w-100 m-0">
                                                            <?php
                                                            echo  $usuarioD->nombre;
                                                            ?>
                                                        </h1>
                                                    </div>
                                                </div>
                                            <?php } ?>

                                        </div>
                                    </button>
                                    <!-- </form> -->
                        <?php }
                            }
                        }
                    }

                    if (!$hayChatEnEsteUsuario) {
                        ?>

                        <div class="text-center h-100 d-flex align-items-center">
                            <p class="w-100 fw-bold fs-4 text-white">No hay chats disponibles<br><span class="small text-dark"><?php echo 'Cree un nuevo chat desde la pantalla puntuaciones'; ?></span></p>
                        </div>
                    <?php
                    }
                    ?>
                </div>
            </div>
            <div class="col-md-4 col-xl-7 col-xxl-7" id="contenedor-chat">

                <?php
                foreach ($chatsDecode as $ucuD) {
                    if ($idChat > 0) {
                        if ($ucuD->id_chat == $idChat) {
                            if ($usuarioActual == $ucuD->id_usuario_creador || $usuarioActual == $ucuD->id_usuario_receptor) {
                                $usuarioABuscarChat = ($usuarioActual == $ucuD->id_usuario_receptor) ? $ucuD->id_usuario_creador : $ucuD->id_usuario_receptor;


                                // echo '<script>console.log(' . json_encode($usuarioABuscarChat) . ');</script>';
                                $usuarioJSON = $usuarioClase->obtenerUsuarios();
                                $usuarioDecode = json_decode($usuarioJSON)->Usuarios;

                                foreach ($usuarioDecode as $usuarioD) {
                                    if ($usuarioABuscarChat == $usuarioD->id_usuario) {
                                        $usuarioABuscarChat = $usuarioD->uid;
                                        break;
                                    }
                                }


                                $usuarioJSONChat = $usuarioClase->obtenerUnUsuario($usuarioABuscarChat);
                                $usuarioDecodeChat = json_decode($usuarioJSONChat)->Usuarios;
                                foreach ($usuarioDecodeChat as $usuarioInfoChat) {

                                    $idReceptor = $usuarioInfoChat->id_usuario;
                                    $fotoReceptor = $usuarioInfoChat->imagen;
                ?>
                                    <div class="vista-chat"><img class="rounded-circle" id="foto-banner" width="50" height="50" src="<?php echo $fotoReceptor; ?>">
                                        <h1 id="nombre-msj">
                                            <?php

                                            echo $usuarioInfoChat->nombre;
                                            ?>
                                        </h1>
                                        <span id="rol-msj">Jugador desde: <?php echo date("d-m-Y", strtotime($usuarioInfoChat->fecha_registro)); ?></span>


                                    </div>
                        <?php
                                    break;
                                }
                            }
                        }
                    } else {
                        ?>
                        <div class="vista-chat">
                        </div>
                <?php
                        break;
                    }
                }
                ?>
                <div class="contenedor-mensajes" id="contenedor-mensajes">
                    <?php if ($idChat == 0) { ?>
                        <div class="text-center h-100 d-flex align-items-center">
                            <p class="w-100 fw-bold fs-4">Seleccione un chat o inicie una nueva conversación</p>
                        </div>
                        <?php } else {
                        if (count($mensajesDecode) > 0) {
                            $escribioMensaje = false;
                            foreach ($mensajesDecode as $mensajeD) {
                                if ($idReceptor == $mensajeD->id_usuario_creador || $idReceptor == $mensajeD->id_usuario_receptor) {
                                    $fechaCreacion = new DateTime($mensajeD->fecha_creacion);
                                    $fechaFormateada = $fechaCreacion->format('d-m-Y');
                                    $horaFormateada = $fechaCreacion->format('h:i A');
                                    if ($usuarioActual == $mensajeD->id_usuario_creador) {
                                        $escribioMensaje = true;
                        ?>
                                        <div class="mensaje-enviado w-75 mt-2 mb-1 ms-auto me-3">
                                            <div class="w-100 px-3 d-flex align-items-center">
                                                <div class="mismaLinea text-start col-3 ms-auto">
                                                    <div class="row">
                                                        <div class="col">
                                                            <span style="color: rgb(184, 184, 184);"><?php echo $fechaFormateada; ?></span>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col">
                                                            <span style="color: rgb(184, 184, 184);"><?php echo $horaFormateada; ?></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span class="text-start col-9 my-2 ms-auto" style="color: rgb(255, 255, 255); font-size: 17px;"><?php echo $mensajeD->texto; ?></span>
                                            </div>
                                            <img class="rounded-circle mt-2 me-2" width="50" height="50" src="<?php echo $fotoPerfilActual; ?>">
                                        </div>

                                    <?php } elseif ($usuarioActual == $mensajeD->id_usuario_receptor) {
                                        $escribioMensaje = true;
                                    ?>
                                        <div class="mensaje-recibido w-75 mt-2 mb-1 ms-3 me-auto">
                                            <img class="rounded-circle mt-2 ms-2" width="50" height="50" src="<?php echo $fotoReceptor; ?>">
                                            <div class="w-100 px-3 d-flex align-items-center">
                                                <span class="text-start col-9 my-2" style="color: rgb(255, 255, 255); font-size: 17px;"><?php echo $mensajeD->texto; ?></span>
                                                <div class="mismaLinea text-end col-3 ms-auto">
                                                    <div class="row">
                                                        <div class="col">
                                                            <span style="color: rgb(184, 184, 184);"><?php echo $fechaFormateada; ?></span>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col">
                                                            <span style="color: rgb(184, 184, 184);"><?php echo $horaFormateada; ?></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                <?php }
                                }
                            }

                            if (!$escribioMensaje) {
                                ?>
                                <div class="text-center h-100 d-flex align-items-center">
                                    <p class="w-100 fw-bold fs-4">No hay mensajes, escríba y envíe alguno</p>
                                </div>
                            <?php
                            }
                        } else {
                            ?>
                            <div class="text-center h-100 d-flex align-items-center">
                                <p class="w-100 fw-bold fs-4">No hay mensajes, escríba y envíe alguno</p>
                            </div>
                    <?php
                        }
                    } ?>
                </div>
                <div id="contenedor-enviar">
                    <?php if ($idChat != 0) { ?>
                        <form id="FormularioEnviarMensaje">
                            <input type="hidden" name="idCreador" id="idCreador" value="<?php echo $usuarioActualInt; ?>">
                            <input type="hidden" name="idReceptor" id="idReceptor" value="<?php echo $idReceptor; ?>">
                            <input type="hidden" name="idChat" id="idChat" value="<?php echo $idChat; ?>">
                            <input type="text" class="input-msj input-desplazado" name="mensajeChat" id="mensajeChat" placeholder="Nuevo mensaje" maxlength="100" autocomplete="off">
                            <button class="btn btn-primary btn-enviar" type="submit" title="Enviar">
                                <i class="fab fa-telegram-plane flecha"></i>
                            </button>
                        </form>
                    <?php } else { ?>
                        <!-- <input type="hidden" name="idReceptor" id="idReceptor" value="<?php echo $idReceptor; ?>"> -->
                        <input type="hidden" name="idChat" id="idChat" value="<?php echo $idChat; ?>">
                    <?php } ?>
                </div>
            </div>
        </div>
    </div>

    <script src="js/crear-chat.js"></script>
    <script src="js/bs-init-chat.js"></script>
</body>

</html>