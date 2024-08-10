// const loadTopDownload = (search) => {
//   document.getElementById("top_download").innerHTML = "";
//   fetch(`http://127.0.0.1:8000/games/list/?search=${search ? search : ""}`)
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.results.length > 0) {
//         displayTopDownload(data.results);
//       } else {
//         document.getElementById("top_download").innerHTML = "";
//       }
//     })
// };

// const displayTopDownload = (games) => {
//   const dTdParent = document.getElementById("top_download");
//   dTdParent.innerHTML = "";
//   games?.slice(0, 3).forEach((game) => {
//     const li = document.createElement("li")
//     li.innerHTML = `
//         <img src=${game.image} alt="" class="templatemo-item">
//         <h4>${game.title}</h4>
//         <h6>${game.genre}</h6>
//         <span><i class="fa fa-star" style="color: yellow;"></i> ${game.rating}</span>
//         <span><i class="fa fa-download" style="color: #ec6090;"></i> ${game.download_count}M</span>
//         <div class="download">
//         <a href="${game.download_link}" target="_blank"><i class="fa fa-download"></i></a>
//         </div>
//     `;
//   dTdParent.appendChild(li);
//   });
// };

const handleSearchGame = () => {
  const value = document.getElementById("searchText").value;
  loadGames2(value);
};

const fetchGenres = () => {
  fetch("http://127.0.0.1:8000/games/genres/")
    .then((response) => response.json())
    .then((genres) => {
      const genreSelect = document.getElementById("game-genre");
      genres.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching genres:", error));
};

const gameFilter = () => {
  const selectedGenre = document.getElementById("game-genre").value;
  loadGames2(selectedGenre);
};

let currentPage = 1;
let nextPageUrl = null;
let previousPageUrl = null;
let itemPerPage = 0;

const sortGames = () => {
  const sortBy = document.getElementById("sort-games").value;
  fetch(`http://127.0.0.1:8000/games/list/?ordering=-${sortBy ? sortBy : ""}&page=${currentPage}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length > 0) {
        document.getElementById("nodata2").style.display = "none";
        displayGames2(data.results);
        nextPageUrl = data.next;
        previousPageUrl = data.previous;
        itemPerPage = data.page_size;
        updatePaginationControls(data.count);
      } else {
        document.getElementById("games2").innerHTML = "";
        document.getElementById("nodata2").style.display = "block";
      }
    })
    .catch((error) => console.error("Error fetching games:", error));
};

const loadGames2 = (search) => {
  fetch(`http://127.0.0.1:8000/games/list/?search=${search ? search : ""}&page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length > 0) {
        document.getElementById("nodata2").style.display = "none";
        displayGames2(data.results);
        nextPageUrl = data.next;
        previousPageUrl = data.previous;
        itemPerPage = data.page_size;
        updatePaginationControls(data.count);
      } else {
        document.getElementById("games2").innerHTML = "";
        document.getElementById("nodata2").style.display = "block";
      }
    })
    .catch((error) => console.error("Error fetching games:", error));
};

const displayGames2 = (games) => {
  const dGparent = document.getElementById("games2");
  dGparent.innerHTML = "";
  games.forEach((game) => {
    const div = document.createElement("div");
    div.classList.add("col-lg-3", "col-sm-6");
    div.innerHTML = `
      <a href="details.html?game_id=${game.id}">
        <div class="item">
          <img src=${game.image} alt="">
          <h4>${game.title}<br><span>${game.genre}</span></h4>
          <ul>
            <li><i class="fa fa-star"></i> ${game.rating}</li>
            <li><i class="fa fa-download"></i> ${game.download_count}M</li>
          </ul>
        </div>
      </a>
    `;
    dGparent.appendChild(div);
  })
};

const updatePaginationControls = (totalCount) => {
  const totalPages = Math.ceil(totalCount / itemPerPage);
  const paginationControls = document.getElementById("pagination-controls");
  paginationControls.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.textContent = "Prev";
  prevButton.disabled = !previousPageUrl;
  prevButton.onclick = () => {
    if (previousPageUrl) {
      currentPage--;
      sortGames();
      loadGames2();
    }
  };
  paginationControls.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.disabled = false;
    pageButton.onclick = () => {
      currentPage = i;
      sortGames();
      loadGames2();
    };
    paginationControls.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = !nextPageUrl;
  nextButton.onclick = () => {
    if (nextPageUrl) {
      currentPage++;
      sortGames();
      loadGames2();
    }
  };
  paginationControls.appendChild(nextButton);
};


// loadTopDownload();
loadGames2();
fetchGenres();