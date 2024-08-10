const handleSearch = () => {
  const value = document.getElementById("searchText").value;
  loadGames(value);
  loadStreams(value);
};

const loadGames = (search) => {
  // document.getElementById("spinner").style.display = "block";
  fetch(`https://cyborg-gamezone.onrender.com/games/list/?search=${search ? search : ""}`)
  .then((res) => res.json())
  .then((data) => {
    if (data.results.length > 0) {
      // document.getElementById("spinner").style.display = "none";
      document.getElementById("nodata").style.display = "none";
      displayGames(data.results);    
    } else {
      document.getElementById("games").innerHTML = "";
      // document.getElementById("spinner").style.display = "none";
      document.getElementById("nodata").style.display = "block";
    }
  })
};

const displayGames = (games) => {
  const parent = document.getElementById("games");
  parent.innerHTML = "";
  games?.slice(0,4).forEach((game) => {
    const div = document.createElement("div");
    div.classList.add("col-lg-3", "col-sm-6");
    div.innerHTML = `
      <a href="details.html?game_id=${game.id}">
        <div class="item">
          <img src="${game.image}" alt="">
          <h4>${game.title}<br><span>${game.genre}</span></h4>
          <ul>
            <li><i class="fa fa-star"></i> ${game.rating}</li>
            <li><i class="fa fa-download"></i> ${game.download_count}M</li>
          </ul>
        </div>
      </a>
    `;
    parent.appendChild(div);
  }) 
};

const loadStreams = (search) => {
  // document.getElementById("spinner").style.display = "block";
  fetch(`https://cyborg-gamezone.onrender.com/streams/list/?search=${search ? search : ""}`)
  .then((res) => res.json())
  .then((data) => {
    if (data.results.length > 0) {
      // document.getElementById("spinner").style.display = "none";
      document.getElementById("nodata3").style.display = "none";
      displayStreams(data.results);
    } else {
      document.getElementById("streams").innerHTML = "";
      // document.getElementById("spinner").style.display = "none";
      document.getElementById("nodata3").style.display = "block";
    }
  })
};

const displayStreams = (streams) => {
  const parent = document.getElementById("streams");
  parent.innerHTML = "";
  streams?.slice(0,4).forEach((stream) => {
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
                <li><a href="#"><i class="fa fa-gamepad"></i> ${stream.game}</a></li>
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
    parent.appendChild(div);
  }) 
};


loadGames();
loadStreams();
