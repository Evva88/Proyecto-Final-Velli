const loginUser = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
  
    try {
      const response = await fetch("/api/sessions/login/", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ email: email, password: password }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      if (data.status === "success") {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.log("Hubo un problema con la operación, usuario o contraseña incorrectos", error);
    }
  };
  document.getElementById("btnLogIn").onclick = loginUser;