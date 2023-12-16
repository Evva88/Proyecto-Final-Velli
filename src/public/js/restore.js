const restorePassword = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const response = await fetch(`/api/sessions/restore?user=${email}&pass=${password}`, {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ email: email, password: password }),
      });
    
    const data = await response.json();
    if (data.status === 200) {
      window.location.href = data.redirect;
    }
}

document.getElementById("btnRestore").onclick = restorePassword;