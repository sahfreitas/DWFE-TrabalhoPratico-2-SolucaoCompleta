function getTodosAlbunsDetalhes() {
    const sessao  = sessionStorage.getItem("tracklist_logado");
    const usuario = sessao ? JSON.parse(sessao) : null;
    const userId  = usuario ? (usuario.id || usuario.email) : null;
    const chave   = userId ? "albuns_" + userId : null;

    const cadastrados = chave
        ? (JSON.parse(localStorage.getItem(chave)) || [])
        : [];

    const idsFixos         = itens.albuns.map(a => a.id);
    const novosCadastrados = cadastrados.filter(a => !idsFixos.includes(Number(a.id)));

    return [...itens.albuns, ...novosCadastrados];
}

const params  = new URLSearchParams(window.location.search);
const albumId = params.get("id");

const todosAlbuns = getTodosAlbunsDetalhes();

const album = todosAlbuns.find(a => String(a.id) === String(albumId));

const albumHeader  = document.getElementById("album-header");
const tracklist    = document.getElementById("tracklist");
const relatedAlbums = document.getElementById("related-albums");

if (!album) {
    albumHeader.innerHTML = `
        <p style="font-family:'DM Sans',sans-serif; color:#666; padding:2rem 0;">
            Álbum não encontrado. <a href="homepage.html">← Voltar</a>
        </p>`;
} else {

    albumHeader.innerHTML = `
    <div class="album-layout">
        <div class="album-cover">
            <img src="${album.imagem_principal}" alt="${album.nome}">
        </div>

        <div class="album-info">
            <span class="artist-name">${album.artista}</span>

            <h1 class="album-title">${album.nome}</h1>

            <div class="album-meta">
                <div>
                    <span>Gênero</span>
                    <strong>${album.genero}</strong>
                </div>
                <div>
                    <span>Ano</span>
                    <strong>${album.data ? album.data.slice(0, 4) : "—"}</strong>
                </div>
                <div>
                    <span>Faixas</span>
                    <strong>${(album.faixas || []).length}</strong>
                </div>
            </div>

            <p class="album-description">${album.conteudo || album.descricao || ""}</p>
        </div>
    </div>
    `;

    (album.faixas || []).forEach((faixa, index) => {
        tracklist.innerHTML += `
        <div class="track-item">
            <div class="track-left">
                <span class="track-number">${index + 1}</span>
                <span class="track-name">${faixa.nome}</span>
            </div>
            <span class="track-duration">${faixa.duracao}</span>
        </div>
        `;
    });

    const relacionados = todosAlbuns.filter(a => String(a.id) !== String(album.id));

    relacionados.forEach(relacionado => {
        relatedAlbums.innerHTML += `
        <a href="detalhes.html?id=${relacionado.id}" class="related-card">
            <img src="${relacionado.imagem_principal}" alt="${relacionado.nome}"
                 onerror="this.src='https://placehold.co/80x80?text=?'">
        </a>
        `;
    });
}