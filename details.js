const getparams = () => {
  const param = new URLSearchParams(window.location.search).get("game_id");
  localStorage.setItem("game_id", param);
  fetch(`https://cyborg-gamezone.onrender.com/games/list/${param}`)
    .then((res) => res.json())
    .then((data) => displayDetails(data));
};

const displayDetails = (game) => {
  const parent = document.getElementById("game-details");
  const div = document.createElement("div");
  div.innerHTML = `
    <!-- ***** Featured Start ***** -->
    <div class="row">
      <div class="col-lg-12">
        <div class="feature-banner header-text">
          <div class="row">
            <div class="col-lg-4">
              <img src="${game.image}" alt="">
            </div>
            <div class="col-lg-8">
              <div class="thumb">
                <img src="${game.thumbnail}" alt="">
                <a href="${game.video}" target="_blank"><i class="fa fa-play"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ***** Featured End ***** -->

    <!-- ***** Details Start ***** -->
    <div class="game-details">
      <div class="row">
        <div class="col-lg-12">
          <h2>${game.title} Details</h2>
        </div>
        <div class="col-lg-12">
          <div class="content">
            <div class="row">
              <div class="col-lg-6">
                <div class="left-info">
                  <div class="left">
                    <h4>${game.title}</h4>
                    <span>${game.genre}</span>
                  </div>
                  <ul>
                    <li><i class="fa fa-star"></i> ${game.rating}</li>
                    <li><i class="fa fa-download"></i> ${game.download_count}M</li>
                  </ul>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="right-info">
                  <ul>
                    <li><i class="fa fa-star"></i> ${game.rating}</li>
                    <li><i class="fa fa-download"></i> ${game.release_date}</li>
                    <li><i class="fa fa-server"></i> ${game.size}GB</li>
                    <li><i class="fa fa-gamepad"></i> ${game.owner}</li>
                  </ul>
                </div>
              </div>
              <div class="screenshot col-lg-4">
                <img src="${game.SS1}" alt="">
              </div>
              <div class="screenshot col-lg-4">
                <img src="${game.SS2}" alt="">
              </div>
              <div class="screenshot col-lg-4">
                <img src="${game.SS3}" alt="">
              </div>
              <div class="col-lg-12">
                <p>${game.description}</p>
              </div>
              <div class="col-lg-6">
                <div class="main-border-button">
                  <a href="${game.download_link}" target="_blank">Download Now</a>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="main-border-button">
                  <a href="#" id="funcLibrary" onclick="handleLibrary()">Add to Library</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ***** Details End ***** -->
  `;
  parent.appendChild(div);
};

const loadRelatedStreams = () => {
  const gameId = localStorage.getItem("game_id");
  fetch(`https://cyborg-gamezone.onrender.com/streams/list/?game=${gameId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length > 0) {
        document.getElementById("nodata6").style.display = "none";
        displayRelatedStreams(data.results);
      } else {
        document.getElementById("relatedStreams").innerHTML = "";
        document.getElementById("nodata6").style.display = "block";
      }
    });
};

const displayRelatedStreams = (streams) => {
  const dSparent = document.getElementById("relatedStreams");
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
  });
};

getparams();
loadRelatedStreams();
