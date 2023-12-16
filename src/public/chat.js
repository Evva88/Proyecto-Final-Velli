const socketClient=io()
const nombreUsuario=document.getElementById("nombreusuario")
const formulario=document.getElementById("formulario")
const inputmensaje=document.getElementById("mensaje")
const chat=document.getElementById("chat")


// Recibe al usuario y cumple con las tareas del chat 

let usuario=null

if(!usuario){
    Swal.fire({
        title:"Tu Previa te da la bienvenida a su chat",
        text:"Ingresa tu correo electronico",
        input:"text",
        inputValidator:(value)=>{
            if(!value){
                return "Necesitas ingresar tu Nombre"
            }
        }
    })
    .then(username=>{
        usuario=username.value
        nombreUsuario.innerHTML=usuario
        socketClient.emit("nuevousuario",usuario)
    })
}

formulario.onsubmit=(e)=>{
    e.preventDefault()
    const info={
        user:usuario,
        message:inputmensaje.value
    }
    console.log(info)
    socketClient.emit("mensaje",info)
    inputmensaje.value=" "

}

//Determina como se vera el mensaje del cliente
 socketClient.on("chat",mensaje=>{
   const chatrender=mensaje.map(e=>{
    return `<p><strong>${e.user}</strong>${e.message}`}).join(" ")
   chat.innerHTML=chatrender
   
   
 })

 //Ingreso de nuevo usuario al chat

 socketClient.on("broadcast",usuario=>{
    Toastify({
        text:`Ingreso ${usuario} al chat`,
        duration:5000,
        position:'right',
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          }
    }).showToast()
 })