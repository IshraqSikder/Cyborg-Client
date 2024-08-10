// const loadTopDownload = (search) => {
//   document.getElementById("top_download").innerHTML = "";
//   fetch(`https://cyborg-gamezone.onrender.com/games/list/?search=${search ? search : ""}`)
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
//   const parent = document.getElementById("top_download");
//   parent.innerHTML = "";
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
//   parent.appendChild(li);
//   });
// };

const handleSearchStream = () => {
  const value = document.getElementById("searchText").value;
  loadStreams2(value);
};

let currentPage = 1;
let nextPageUrl = null;
let previousPageUrl = null;
let itemPerPage = 0;

const fetchStreamers = () => {
  fetch("https://cyborg-gamezone.onrender.com/streams/streamers/")
    .then((response) => response.json())
    .then((streamers) => {
      const streamerSelect = document.getElementById("stream-streamer");
      streamers.forEach((streamer) => {
        const option = document.createElement("option");
        option.value = streamer.streamer__id;
        option.textContent = streamer.streamer__userName__username;
        streamerSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching streamers:", error));
};

const streamByStreamerFilter = () => {
  const selectedstreamer = document.getElementById("stream-streamer").value;
  fetch(`https://cyborg-gamezone.onrender.com/streams/list/?streamer=${selectedstreamer}&page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length > 0) {
        document.getElementById("nodata4").style.display = "none";
        displayStreams2(data.results);
        nextPageUrl = data.next;
        previousPageUrl = data.previous;
        itemPerPage = data.page_size;
        updatePaginationControls(data.results.length);
      } else {
        document.getElementById("streams2").innerHTML = "";
        document.getElementById("nodata4").style.display = "block";
      }
    });
};

const fetchGames = () => {
  fetch("https://cyborg-gamezone.onrender.com/streams/games/")
    .then((response) => response.json())
    .then((games) => {
      const gameSelect = document.getElementById("stream-game");
      games.forEach((game) => {
        const option = document.createElement("option");
        option.value = game.game__id;
        option.textContent = game.game__title;
        gameSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching games:", error));
};

const streamByGameFilter = () => {
  const selectedgame = document.getElementById("stream-game").value;
  fetch(`https://cyborg-gamezone.onrender.com/streams/list/?game=${selectedgame}&page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length > 0) {
        document.getElementById("nodata4").style.display = "none";
        displayStreams2(data.results);
        nextPageUrl = data.next;
        previousPageUrl = data.previous;
        itemPerPage = data.page_size;
        updatePaginationControls(data.results.length);
      } else {
        document.getElementById("streams2").innerHTML = "";
        document.getElementById("nodata4").style.display = "block";
      }
    });
};

const loadStreams2 = (search) => {
  fetch(`https://cyborg-gamezone.onrender.com/streams/list/?search=${search ? search : ""}&page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length > 0) {
        document.getElementById("nodata4").style.display = "none";
        displayStreams2(data.results);
        nextPageUrl = data.next;
        previousPageUrl = data.previous;
        itemPerPage = data.page_size;
        updatePaginationControls(data.count);
      } else {
        document.getElementById("streams2").innerHTML = "";
        document.getElementById("nodata4").style.display = "block";
      }
    })
    .catch((error) => console.error("Error fetching streams:", error));
};

const displayStreams2 = (streams) => {
  const dSparent = document.getElementById("streams2");
  dSparent.innerHTML = "";
  streams.forEach((stream) => {
    const div = document.createElement("div");
    div.classList.add("col-lg-3", "col-sm-6");
    div.innerHTML = `
      <div class="item">
        <div class="thumb">
          <img src="${stream.image}" alt="">
          <div class="hover-effect">
            <div class="content">
              <div class="live">
                <a href="${stream.url}" target="_blank">Watch</a>
              </div>
              <ul>
                <li><a href="#"><i class="fa fa-eye"></i> 1.2K</a></li>
                <li><a href="#"><i class="fa fa-gamepad"></i> ${stream.gameDetails.title}-${stream.gameDetails.genre}</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="down-content">
          <div class="avatar">
            <img src="https://cyborg-gamezone.onrender.com/${stream.streamerDetails.avatar}" alt="" style="max-width: 46px; border-radius: 50%; float: left;">
          </div>
          <span><i class="fa fa-check"></i> ${stream.streamerDetails.streamer}</span>
          <h4>${stream.title}</h4>
        </div>
      </div>
    `;
    dSparent.appendChild(div);
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
      loadStreams2();
    }
  };
  paginationControls.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.disabled = false;
    pageButton.onclick = () => {
      currentPage = i;
      loadStreams2();
    };
    paginationControls.appendChild(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.disabled = !nextPageUrl;
  nextButton.onclick = () => {
    if (nextPageUrl) {
      currentPage++;
      loadStreams2();
    }
  };
  paginationControls.appendChild(nextButton);
};

const loadChooseStreamGame = (page = 1) => {
  fetch(`https://cyborg-gamezone.onrender.com/games/list/?page=${page}`)
    .then((res) => res.json())
    .then((data) => {
      data.results.forEach((item) => {
        const parent = document.getElementById("choose-stream-game");
        const option = document.createElement("option");
        option.value = item.id;
        option.innerText = item.title;
        parent.appendChild(option);
      });

      if (data.next) {
        loadChooseStreamGame(page + 1);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
};

const addStream = async (event) => {
  event.preventDefault();
  
  const streamTitle = document.getElementById("choose-stream-title").value;
  const streamGame = document.getElementById("choose-stream-game");
  const selectedStreamGame = streamGame.options[streamGame.selectedIndex].value;
  const streamImage = document.getElementById("choose-stream-image").files[0];
  let streamUrl = document.getElementById("choose-stream-url").value;
  const clientId = localStorage.getItem("client_id");

  if (!streamTitle || !selectedStreamGame || !streamImage || !streamUrl) {
    document.getElementById("error").textContent = "All fields are required";
    return;
  }

  // Ensure the URL starts with http:// or https://
  if (!streamUrl.match(/^(http:\/\/|https:\/\/)/i)) {
    streamUrl = `https://${streamUrl}`;
  }

  let streamerDetails;
  let gameDetails;
  try {
    const res1 = await fetch(`https://cyborg-gamezone.onrender.com/clients/list/${clientId}`);
    if (!res1.ok) throw new Error(`Error fetching client data: ${res1.statusText}`);
    const data1 = await res1.json();
    streamerDetails = data1.userName.username;

    const res2 = await fetch(`https://cyborg-gamezone.onrender.com/games/list/${selectedStreamGame}`);
    if (!res2.ok) throw new Error(`Error fetching game data: ${res2.statusText}`);
    const data2 = await res2.json();
    gameDetails = {
      title: data2.title,
      genre: data2.genre
    };

  } catch (error) {
    console.error('Error fetching data:', error);
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", streamTitle);
    formData.append("game", selectedStreamGame);
    formData.append("image", streamImage);
    formData.append("url", streamUrl);
    formData.append("streamer", clientId);
    formData.append("streamerDetails", streamerDetails);
    formData.append("gameDetails", gameDetails);

    const response = await fetch(`https://cyborg-gamezone.onrender.com/streams/list/`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      document.getElementById("error").textContent = "Stream added successfully";
      alert('Stream added successfully');
      window.location.href = 'profile.html';
    } else {
      const errorData = await response.json();
      const errorDetail = errorData.detail || 'Error adding stream';
      alert(errorDetail);
      console.error('Error adding stream:', response.statusText, errorData);
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
};


// loadTopDownload();
loadStreams2();
fetchGames();
fetchStreamers();
loadChooseStreamGame();