document.addEventListener("DOMContentLoaded", () => {

    const dadosLogado = sessionStorage.getItem("tracklist_logado");

    if (!dadosLogado) {
        window.location = "index.html";
        return;
    }

    const usuario = JSON.parse(dadosLogado);
    const userId  = usuario.id || usuario.email;

    const chave      = `favoritos_${userId}`;
    const idsFavs    = JSON.parse(localStorage.getItem(chave)) || [];

    const _chaveAlbuns = "albuns_" + userId;
    const cadastrados  = JSON.parse(localStorage.getItem(_chaveAlbuns)) || [];
    const idsFixos     = itens.albuns.map(a => a.id);
    const extras       = cadastrados.filter(a => !idsFixos.includes(a.id));
    const todosAlbuns  = [...itens.albuns, ...extras];

    const idsFavsNum       = idsFavs.map(Number);
    const albumsFavoritados = todosAlbuns.filter(a => idsFavsNum.includes(Number(a.id)));

    const favList = document.getElementById("favoritos-list");

    if (albumsFavoritados.length === 0) {
        favList.innerHTML = `
            <p class="sem-resultados">
                Você ainda não favoritou nenhum álbum.
                <a href="homepage.html">Explorar catálogo →</a>
            </p>
        `;
        return;
    }

    albumsFavoritados.forEach(album => {
        const col  = document.createElement("div");
        col.classList.add("col-12", "col-md-6", "col-lg-3");

        const card = document.createElement("div");
        card.classList.add("card", "rounded-0", "h-100");

        const imgWrapper = document.createElement("div");
        imgWrapper.style.position = "relative";

        const img = document.createElement("img");
        img.src   = album.imagem_principal;
        img.classList.add("card-img-top");

        const btnFav = document.createElement("button");
        btnFav.classList.add("btn-favoritar");
        btnFav.setAttribute("aria-label", "Remover dos favoritos");
        btnFav.innerHTML = heartSVGFavoritos(true);

        btnFav.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const favs    = (JSON.parse(localStorage.getItem(chave)) || []).map(Number);
            const novoArr = favs.filter(id => id !== Number(album.id));
            localStorage.setItem(chave, JSON.stringify(novoArr));

            col.style.transition = "opacity .3s, transform .3s";
            col.style.opacity    = "0";
            col.style.transform  = "scale(0.95)";
            setTimeout(() => {
                col.remove();
                if (favList.querySelectorAll(".col-12").length === 0) {
                    favList.innerHTML = `
                        <p class="sem-resultados">
                            Você ainda não favoritou nenhum álbum.
                            <a href="homepage.html">Explorar catálogo →</a>
                        </p>
                    `;
                }
            }, 300);
        });

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(btnFav);

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title", "fw-bold");
        title.textContent = album.nome;

        const artist = document.createElement("p");
        artist.classList.add("card-text", "text-secondary");
        artist.textContent = album.artista;

        const genre = document.createElement("span");
        genre.classList.add("badge", "text-bg-dark", "rounded-0", "mb-3");
        genre.textContent = album.genero;

        const verBtn = document.createElement("a");
        verBtn.classList.add("btn", "btn-light", "rounded-0");
        verBtn.textContent = "Ver álbum";
        verBtn.href        = `detalhes.html?id=${album.id}`;

        cardBody.appendChild(title);
        cardBody.appendChild(artist);
        cardBody.appendChild(genre);
        cardBody.appendChild(verBtn);

        card.appendChild(imgWrapper);
        card.appendChild(cardBody);
        col.appendChild(card);
        favList.appendChild(col);
    });
});

function heartSVGFavoritos(preenchido) {
    const fill = preenchido ? "#1a1a1a" : "none";
    return `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="18" height="18"
             viewBox="0 0 24 24"
             fill="${fill}"
             stroke="#1a1a1a"
             stroke-width="2"
             stroke-linecap="round"
             stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
    `;
}