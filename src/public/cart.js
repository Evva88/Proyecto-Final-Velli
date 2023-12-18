const obtenerIdCarrito = async () => {
  try {
    const response = await fetch("/api/carts/usuario/carrito", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Error obteniendo el ID del carrito");
      return null;
    }
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.log("Error en obtener el Id del Carrito! ", error);
    return null;
  }
};

const agregarProductoAlCarrito = async (pid) => {
  try {
    const cid = await obtenerIdCarrito();

    if (!cid) {
      console.error("El ID del carrito es inválido.");
      return;
    }
    
    const response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });

    if (!response.ok) {
      console.log("Error al agregar el producto al carrito");
      return;
    } 
    
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado al carrito',
      showConfirmButton: false,
      timer: 1500,  // Cierra automáticamente después de 1.5 segundos
    });

    console.log("Se agrego el producto al carrito");
  } catch (error) {
    console.log("Error en agregar el Producto al Carrito! " + error);
  }
};

async function realizarCompra() {
  try {
    const cid = await obtenerIdCarrito();
  
    if (!cid) {
      console.error("Carrito no encontrado");
      return;
    }

    const response = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
 
    if (!response.ok) {
      console.error("Error al realizar la compra");
      return;
    }
    window.location.href = "/compra";
    console.log("Compra realizada con éxito"); 

  } catch (error) {
  
    console.error("Error al realizar la compra", error);
  }

}

document.addEventListener("DOMContentLoaded", () => {
  const cartButton = document.getElementById("cartButton");

  if (cartButton) {
    cartButton.addEventListener("click", async () => {
      try {
        const cid = await obtenerIdCarrito();
        if (cid) {
          window.location.assign(`/carts/`);
        } else {
          console.error("El ID del carrito no es valido");
        }
      } catch (error) {
        console.error("Error al obtener el ID del carrito: " + error);
      }
      e.preventDefault();
    });
  }
});

function eliminarProducto(productoTitle) {
  console.log(`Eliminar producto: ${productoTitle}`);
}
