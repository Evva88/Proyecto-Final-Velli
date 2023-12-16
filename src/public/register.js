const registerUser = async () => {
    let first_name = document.getElementById("first_name").value;
    let last_name = document.getElementById("last_name").value;
    let email = document.getElementById("email").value;
    let age = document.getElementById("age").value;
    let password = document.getElementById("password").value;
  
    const user = { first_name, last_name, email, age, password };
  
    try {
      const response = await fetch("/api/sessions/register", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(user),
      });
  
      if (!response.ok) {
          console.error("Error al registrar el usuario:", await response.text());
      } else {
          const data = await response.json();
          if (data.status === "success" && data.redirect) {
              window.location.href = data.redirect;
          }
      }
    } catch (error) {
      console.error("Hubo un error al registrar el usuario:", error);
    }
  };
  
  document.getElementById("btnRegister").onclick = registerUser;
