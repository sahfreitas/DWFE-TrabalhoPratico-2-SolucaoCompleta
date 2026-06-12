function cadastrarUsuario() {
    const emailInformado = document.getElementById("email").value;
    const senhaInformada = document.getElementById("senha").value;

    const usuarios = JSON.parse(localStorage.getItem("tracklist_usuarios")) || [];
    const usuarioExistente = usuarios.find(u => u.email === emailInformado);

    if (usuarioExistente) {
        alert("E-mail já cadastrado!");
    } else {
        const novoUsuario = {
            email: emailInformado,
            senha: senhaInformada
        };
        usuarios.push(novoUsuario);
        localStorage.setItem("tracklist_usuarios", JSON.stringify(usuarios));
        alert("Cadastro realizado com sucesso!");
        window.location = "index.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const botao = document.querySelector("button");
    botao.addEventListener("click", (e) => {
        e.preventDefault();
        cadastrarUsuario();
    });
});