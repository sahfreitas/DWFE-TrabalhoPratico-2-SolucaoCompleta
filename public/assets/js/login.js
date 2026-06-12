function verificarCredenciais() {
    const emailInformado = document.getElementById("email").value;
    const senhaInformada = document.getElementById("senha").value;

    const usuarios = JSON.parse(localStorage.getItem("tracklist_usuarios")) || [];
    const usuario = usuarios.find(u => u.email === emailInformado);

    if (usuario) {
        if (senhaInformada === usuario.senha) {
            sessionStorage.setItem("tracklist_logado", JSON.stringify({ id: usuario.id, email: usuario.email }));
            window.location = "homepage.html";
        } else {
            alert("Senha informada incorretamente!");
        }
    } else {
        alert("E-mail informado incorretamente!");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const botao = document.querySelector("button");
    botao.addEventListener("click", (e) => {
        e.preventDefault();
        verificarCredenciais();
    });
});

document.getElementById("btn-logout").addEventListener("click", () => {
    sessionStorage.removeItem("tracklist_logado");
    window.location = "index.html";
});

const logado = sessionStorage.getItem("tracklist_logado");
if (!logado) {
    window.location = "index.html";
}