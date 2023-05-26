// Obtener el elemento contenedor de mensajes
var contenedorMensajes = document.getElementById("contenedor-mensajes");

// Validar si el contenedor de mensajes existe
if (contenedorMensajes) {
    // Hacer scroll hacia abajo automáticamente
    contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
}


// Alertas al tocar el botón de submit
var formularioMensajeAMaestro = document.getElementById("formularioMensajeAMaestro");
if (formularioMensajeAMaestro) {
    formularioMensajeAMaestro.addEventListener("submit", function (event) {
        event.preventDefault();

        // console.log('entramos al js')

        // window.location.href = 'mensajes';

        // Obtener los datos del formulario y enviarlos a través de una solicitud AJAX
        // const url = new URL(window.location.href);
        const formData = new FormData(this);
        // formData.append("curso", url.searchParams.get("curso"));
        formData.append("btnCrearChat", "submit");

        $.ajax({
            type: 'POST',
            url: 'controllers/crearChat.php',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                // alert(result)
                // console.log(result)
                // Si la respuesta es verdadera, redirigir al usuario a la página de usuario
                if (result == true) {
                    window.location.href = 'mensajes';
                    // Swal.fire({
                    //     position: 'top-end',
                    //     icon: 'success',
                    //     title: 'Curso agregado carrito',
                    //     // text: 'Se ha registrado el curso con éxito',
                    //     // confirmButtonText: 'Continuar',
                    //     allowOutsideClick: false,
                    //     showConfirmButton: false,
                    //     timer: 1500
                    //     //   footer: '<a href="">Why do I have this issue?</a>'
                    //     // }).then((result) => {
                    //     //     /* Read more about isConfirmed, isDenied below */
                    //     //     if (result.isConfirmed) {
                    //     //         window.location.href = 'profesor-dashboard';
                    //     //     }
                    // })
                } else {
                    // Si la respuesta es falsa, mostrar un mensaje de error al usuario
                    Swal.fire({
                        icon: 'error',
                        title: 'Chat no creado',
                        text: result,
                        confirmButtonText: 'Aceptar',
                        allowOutsideClick: false
                        //   footer: '<a href="">Why do I have this issue?</a>'
                    })
                }
            },
            error: function (error) {
                console.error('Error en la solicitud AJAX:', error);
                // Aquí se puede agregar código para manejar errores de comunicación con el servidor
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo completar la solicitud. Por favor, inténtalo de nuevo más tarde.',
                    allowOutsideClick: false
                });
            }
        });

    });
}

var idChatInput = $('#idChat');
var verAlumnosButton = $('.btnChat');

verAlumnosButton.on('click', mostrarChat);

function mostrarChat() {
    // console.log('jejej')
    var numeroIdChat = parseInt(idChatInput.val());
    var numeroChat = parseInt($(this).val());
    if (numeroIdChat != numeroChat) {
        //     // console.log('pagina distinta');
        idChatInput.val($(this).val());

        //     // Llamar a actualizarReporte al finalizar asignarPagina
        mostrarMensajes();
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Mismo chat',
            text: 'Ya estás en este chat',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
        });
    }
}

var valoresAnteriores = {
    idChat: null
};

function mostrarMensajes() {

    // console.log('mostramos mensajes');
    // Obtener los valores actuales de los elementos
    var idChat = idChatInput.val();

    // Verificar si algún valor ha cambiado desde la última llamada
    var valoresCambiados = {};
    if (idChat !== valoresAnteriores.idChat) {
        valoresCambiados.idChat = idChat;
    }

    // Actualizar los valores anteriores con los valores actuales
    valoresAnteriores.idChat = idChat;

    // Realizar la petición AJAX con jQuery
    $.ajax({
        url: 'controllers/obtener_mensajes.php',
        method: 'POST',
        data: {
            ...valoresCambiados, // Utiliza el spread operator para agregar solo los valores que han cambiado
            btnMensajes: 'submit'
        },
        success: function (response) {
            // Procesar la respuesta del servidor
            var mensajesJSON = response;
            var mensajesDecode = JSON.parse(mensajesJSON).Cursos;
            // console.log('respuesta :' + response)

            // Crear un formulario dinámicamente
            var form = document.createElement('form');
            form.method = 'POST';

            form.action = 'mensajes';

            // Agregar campo oculto para mensajesDecode
            var mensajesInput = document.createElement('input');
            mensajesInput.type = 'hidden';
            mensajesInput.name = 'mensajesDecode';
            mensajesInput.value = JSON.stringify(mensajesDecode);

            // Agregar campo oculto para idChat
            var idChatInput = document.createElement('input');
            idChatInput.type = 'hidden';
            idChatInput.name = 'idChat';
            idChatInput.value = idChat;

            // Agregar los campos al formulario
            form.appendChild(mensajesInput);
            form.appendChild(idChatInput);

            // Agregar el formulario al documento y enviarlo
            document.body.appendChild(form);
            form.submit();
        },
        error: function (xhr, status, error) {
            // Manejar errores en la petición
            console.error(error);
        }
    });

}


var FormularioEnviarMensaje = document.getElementById("FormularioEnviarMensaje");
if (FormularioEnviarMensaje) {
    FormularioEnviarMensaje.addEventListener("submit", function (event) {
        event.preventDefault();

        // console.log("mensaje enviado")
        const formData = new FormData(this);
        // formData.append("curso", url.searchParams.get("curso"));
        formData.append("btnCrearMensaje", "submit");

        $.ajax({
            type: 'POST',
            url: 'controllers/crearMensaje.php',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function (result) {
                // alert(result)
                // console.log(result)
                // Si la respuesta es verdadera, redirigir al usuario a la página de usuario
                if (result == true) {
                    mostrarMensajes();
                } else {
                    // Si la respuesta es falsa, mostrar un mensaje de error al usuario
                    Swal.fire({
                        icon: 'error',
                        title: 'Mensaje no creado',
                        text: result,
                        confirmButtonText: 'Aceptar',
                        allowOutsideClick: false
                        //   footer: '<a href="">Why do I have this issue?</a>'
                    })
                }
            },
            error: function (error) {
                console.error('Error en la solicitud AJAX:', error);
                // Aquí se puede agregar código para manejar errores de comunicación con el servidor
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo completar la solicitud. Por favor, inténtalo de nuevo más tarde.',
                    allowOutsideClick: false
                });
            }
        });

    });
}
