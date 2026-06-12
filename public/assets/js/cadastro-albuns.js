const _sessao = sessionStorage.getItem("tracklist_logado");
if (!_sessao) { window.location = "index.html"; }

const _usuario = _sessao ? JSON.parse(_sessao) : null;
const _userId = _usuario ? (_usuario.id || _usuario.email) : null;

function chaveAlbuns() { return "albuns_" + _userId; }

function migrarAlbunsFixos() {
    const flagChave = "albuns_migrados_" + _userId;
    if (localStorage.getItem(flagChave)) return;

    const jaExistem = JSON.parse(localStorage.getItem(chaveAlbuns())) || [];
    const idsExistentes = jaExistem.map(a => a.id);

    const fixosNovos = itens.albuns.filter(a => !idsExistentes.includes(a.id));

    const fixosMarcados = fixosNovos.map(a => ({
        ...a,
        cadastradoPeloUsuario: false
    }));

    localStorage.setItem(chaveAlbuns(), JSON.stringify([...fixosMarcados, ...jaExistem]));
    localStorage.setItem(flagChave, "1");
}

migrarAlbunsFixos();

function getAlbunsUsuario() {
    return JSON.parse(localStorage.getItem(chaveAlbuns())) || [];
}

function saveAlbunsUsuario(arr) {
    localStorage.setItem(chaveAlbuns(), JSON.stringify(arr));
}

function gerarId() { return Date.now(); }

function abrirFormNovo() {
    limparForm();
    document.getElementById("form-wrapper").style.display = "block";
    document.getElementById("form-wrapper").scrollIntoView({ behavior: "smooth" });
    adicionarFaixa();
}

function fecharForm() {
    document.getElementById("form-wrapper").style.display = "none";
    limparForm();
}

function limparForm() {
    ["album-id", "nome", "artista", "data", "imagem", "descricao", "conteudo"].forEach(id => {
        document.getElementById(id).value = "";
    });
    document.getElementById("genero").value = "";
    document.getElementById("faixas-container").innerHTML = "";
    const prev = document.getElementById("img-preview");
    prev.style.display = "none";
    prev.src = "";
}

function previewImagem(url) {
    const prev = document.getElementById("img-preview");
    if (url.trim()) {
        prev.src = url;
        prev.style.display = "block";
        prev.onerror = () => { prev.style.display = "none"; };
    } else {
        prev.style.display = "none";
    }
}

function adicionarFaixa(nome = "", duracao = "") {
    const container = document.getElementById("faixas-container");
    const row = document.createElement("div");
    row.classList.add("faixa-row");
    row.innerHTML = `
                <input type="text" placeholder="Nome da faixa" value="${nome}" class="faixa-nome">
                <input type="text" placeholder="0:00" value="${duracao}" class="faixa-dur">
                <button type="button" class="btn-rm-faixa" onclick="this.parentElement.remove()" title="Remover faixa">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;
    container.appendChild(row);
}

function coletarFaixas() {
    const nomes = document.querySelectorAll(".faixa-nome");
    const duracoes = document.querySelectorAll(".faixa-dur");
    const faixas = [];
    nomes.forEach((n, i) => {
        if (n.value.trim()) {
            faixas.push({ id: i + 1, nome: n.value.trim(), duracao: duracoes[i].value.trim() || "0:00" });
        }
    });
    return faixas;
}

function validarForm() {
    const obrigatorios = [
        { id: "nome", label: "Nome do álbum" },
        { id: "artista", label: "Artista" },
        { id: "genero", label: "Gênero" },
        { id: "data", label: "Data de lançamento" },
        { id: "imagem", label: "URL da capa" },
        { id: "descricao", label: "Descrição curta" }
    ];
    for (const campo of obrigatorios) {
        if (!document.getElementById(campo.id).value.trim()) {
            toast(`Preencha o campo "${campo.label}".`);
            document.getElementById(campo.id).focus();
            return false;
        }
    }
    return true;
}

function salvarAlbum() {
    if (!validarForm()) return;

    const idRaw = document.getElementById("album-id").value;
    const albuns = getAlbunsUsuario();

    const novo = {
        id: idRaw ? parseInt(idRaw) : gerarId(),
        nome: document.getElementById("nome").value.trim(),
        artista: document.getElementById("artista").value.trim(),
        genero: document.getElementById("genero").value,
        data: document.getElementById("data").value,
        imagem_principal: document.getElementById("imagem").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        conteudo: document.getElementById("conteudo").value.trim(),
        destaque: false,
        faixas: coletarFaixas(),
        cadastradoPeloUsuario: true
    };

    if (idRaw) {
        const idx = albuns.findIndex(a => a.id === novo.id);
        if (idx !== -1) albuns[idx] = novo;
        toast("Álbum atualizado com sucesso!");
    } else {
        albuns.push(novo);
        toast("Álbum cadastrado com sucesso!");
    }

    saveAlbunsUsuario(albuns);
    fecharForm();
    renderTabela();
}

function editarAlbum(id) {
    const album = getAlbunsUsuario().find(a => a.id === id);
    if (!album) return;

    document.getElementById("album-id").value = album.id;
    document.getElementById("nome").value = album.nome;
    document.getElementById("artista").value = album.artista;
    document.getElementById("genero").value = album.genero;
    document.getElementById("data").value = album.data;
    document.getElementById("imagem").value = album.imagem_principal;
    document.getElementById("descricao").value = album.descricao;
    document.getElementById("conteudo").value = album.conteudo || "";

    previewImagem(album.imagem_principal);

    document.getElementById("faixas-container").innerHTML = "";
    (album.faixas || []).forEach(f => adicionarFaixa(f.nome, f.duracao));

    document.getElementById("form-wrapper").style.display = "block";
    document.getElementById("form-wrapper").scrollIntoView({ behavior: "smooth" });
}

function excluirAlbum(id) {
    if (!confirm("Deseja realmente excluir este álbum?")) return;
    saveAlbunsUsuario(getAlbunsUsuario().filter(a => a.id !== id));
    toast("Álbum excluído.");
    renderTabela();
}

function renderTabela() {
    const albuns = getAlbunsUsuario();
    const tbody = document.getElementById("tabela-body");
    const vazio = document.getElementById("vazio-msg");

    tbody.innerHTML = "";

    if (albuns.length === 0) {
        vazio.style.display = "block";
        return;
    }

    vazio.style.display = "none";

    albuns.forEach(album => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>
                        <img src="${album.imagem_principal}" alt="${album.nome}"
                             onerror="this.src='https://placehold.co/48x48?text=?'">
                    </td>
                    <td class="td-nome" title="${album.nome}">${album.nome}</td>
                    <td>${album.artista}</td>
                    <td><span class="badge-genero">${album.genero}</span></td>
                    <td>${album.data ? album.data.slice(0, 4) : "—"}</td>
                    <td>${(album.faixas || []).length}</td>
                    <td>
                        <div class="acoes-cell">
                            <button class="btn-edit" title="Editar" onclick="editarAlbum(${album.id})">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-del" title="Excluir" onclick="excluirAlbum(${album.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </td>
                `;
        tbody.appendChild(tr);
    });
}

function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 3000);
}

renderTabela();