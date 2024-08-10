const token = localStorage.getItem("token");
const userId = localStorage.getItem("user_id");
const clientId = localStorage.getItem("client_id");
const gameId = localStorage.getItem("game_id");

const loadClientId = () => {
  fetch(`http://127.0.0.1:8000/clients/list/?user_id=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length > 0) {
        document.getElementById("permission-accessed").style.display = "block";
        document.getElementById("permission-denied").style.display = "none";
        localStorage.setItem("client_id", data[0].id);
      } else {
        console.log("No user data found");
      }
    });
};

const handleLibrary = async (libId) => {
    console.log("Library ID: " + libId);
    let gameData;

    try {
        const res1 = await fetch(`http://127.0.0.1:8000/games/list/${gameId}`);
        const res2 = await fetch(`http://127.0.0.1:8000/clients/list/${clientId}`);
        if (!res1.ok) throw new Error(`Error fetching game data: ${res1.statusText}`);
        if (!res2.ok) throw new Error(`Error fetching client data: ${res2.statusText}`);
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        gameData = {
            game: data1.id,
            gameDetails: {
                title: data1.title,
                genre: data1.genre,
                image: data1.image
            },
            account: data2.id,
            accountName: data2.userName,
            timestamp: new Date().toISOString(),
            download_state: "Downloaded"
        };
        console.log(gameData);
    } catch (error) {
        console.error('Error fetching game data:', error);
        return;
    }

    const button = document.getElementById('funcLibrary');
    console.log("hello",button.textContent);
    if (button.textContent === 'Add to Library') {
        try {
            const response = await fetch(`http://127.0.0.1:8000/libraries/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gameData)
            });

            if (response.ok) {
                alert('Game added successfully');
            } else {
                const errorData = await response.json();
                const errorDetail = errorData.detail || 'Error adding game';
                alert(errorDetail);
                console.error('Error adding game:', response.statusText, errorData);
            }
        } catch (error) {
            console.error('Network error:', error.message);
        }
    }
    else if (button.textContent === 'Remove From Library') {
        console.log(clientId, gameId);
        try {
            const response = await fetch(`http://127.0.0.1:8000/libraries/${libId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Game removed successfully');
            } else {
                const errorData = await response.json();
                const errorDetail = errorData.detail || 'Error removing game';
                alert(errorDetail);
                console.error('Error removing game:', response.statusText, errorData);
            }
        } catch (error) {
            console.error('Network error:', error.message);
        }
    }

    window.location.href = 'profile.html';
};

function formatTimestamp(timestamp) {
    const time = timestamp.slice(11, 19);
    const [hours, minutes, seconds] = time.split(':');
    return `${hours}h : ${minutes}m : ${seconds}s`;
}

let libraryLength = 0;
let streamProfilelength = 0;

const updateProfileDetails = () => {
    profileDetails(libraryLength, streamProfilelength);
};

const gamingLibrary = () => {
    fetch(`http://127.0.0.1:8000/libraries/?account=${clientId}`)
    .then((res) => res.json())
    .then((data) => {
        libraryLength = data.length;
        updateProfileDetails();
        const library = document.getElementById("library");
        library.innerHTML = "";
        data.forEach((lib) => {
            // console.log(lib);
            if (libraryLength > 0) {
              document.getElementById("no-library-data").style.display = "none";
              const div = document.createElement("div");
              div.classList.add("item");
              div.innerHTML = `
                <ul>
                    <li><img src="${lib.gameDetails.image}" alt="" class="templatemo-item"></li>
                    <li><h4>${lib.gameDetails.title}</h4><span>${lib.gameDetails.genre}</span></li>
                    <li><h4>Date Added</h4><span>${lib.timestamp.slice(0,10)}</span></li>
                    <li><h4>Time Added</h4><span>${formatTimestamp(lib.timestamp)}</span></li>
                    <li><h4>Currently</h4><span>${lib.download_state}</span></li>
                    <li><div class="main-border-button border-no-active"><a href="#" id="funcLibrary" onclick="handleLibrary(${lib.id})">Remove From Library</a></div></li>
                </ul>
            `;
              library.appendChild(div);
            } else {
              document.getElementById("library").innerHTML = "";
              document.getElementById("no-library-data").style.display = "block";
            }
        })
    })
};

const loadStreamsProfile = () => {
  fetch(`http://127.0.0.1:8000/streams/list/?streamer=${clientId}`)
  .then((res) => res.json())
  .then((data) => {
    streamProfilelength = data.results.length;
    updateProfileDetails();
    if (streamProfilelength > 0) {
      document.getElementById("nodata5").style.display = "none";
      displayStreamsProfile(data.results);
    } else {
      document.getElementById("streamsProfile").innerHTML = "";
      document.getElementById("nodata5").style.display = "block";
    }
  })
};

const displayStreamsProfile = (streams) => {
  const dSparent = document.getElementById("streamsProfile");
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
            <img src="http://127.0.0.1:8000/${stream.streamerDetails.avatar}" alt="" style="max-width: 46px; border-radius: 50%; float: left;">
          </div>
          <span><i class="fa fa-check"></i> ${stream.streamerDetails.streamer}</span>
          <h4>${stream.title}</h4>
        </div>
      </div>
    `;
    dSparent.appendChild(div);
  }) 
};

const profileDetails = (libraryLength, streamProfilelength) => {
    // console.log(clientId);
    fetch(`http://127.0.0.1:8000/clients/list/${clientId}`)
    .then((res) => res.json())
    .then((data) => {
        const profilePic = document.getElementById("profilePic");
        profilePic.innerHTML = "";
        const pp_div = document.createElement("div");
        pp_div.innerHTML = `
            <a href="profile.html" id="profileBtn" style="background-color: #27292a; padding: 8px 10px 8px 20px; border-radius: 23px;">Profile <img src="${data.avatar}" alt="" style="max-width: 30px; border-radius: 50%; margin-left: 5px;"></a>
        `;
        profilePic.appendChild(pp_div);
        
        const parent = document.getElementById("profileDetails");
        parent.innerHTML = "";
        const div = document.createElement("div");
        div.classList.add("row");
        div.innerHTML = `
            <div class="col-lg-4">
                <img src="${data.avatar}" alt="" style="border-radius: 23px;">
            </div>
            <div class="col-lg-4 align-self-center">
                <div class="main-info header-text">
                    <a href="change_password.html"><span>Change Password</span></a>
                    <h4>${data.userName.username}</h4>
                    <p>${data.bio}</p>
                    <div class="main-border-button">
                        <a href="add_stream.html" class="me-1">Add stream</a>
                        <a href="edit_profile.html">Edit profile</a>
                    </div>
                </div>
            </div>
            <div class="col-lg-4 align-self-center">
                <ul>
                    <li>Name <span>${data.userName.first_name} ${data.userName.last_name}</span></li>
                    <li>Email <span>${data.userName.email}</span></li>
                    <li>Library Items<span>${libraryLength}</span></li>
                    <li>Total Clips <span>${streamProfilelength}</span></li>
                </ul>
            </div>
        `;
        parent.appendChild(div);
    })
};

const editProfile = (event) => {
    event.preventDefault();
    const bio = document.getElementById("change-bio").value;
    const avatar = document.getElementById("change-avatar").files[0];
    const form = document.querySelector('form');
    const formData = new FormData(form);
    if (!bio) {
        document.getElementById("bio-error").textContent = "Bio cannot be blank";
        return;
    } else {
        formData.append("bio", bio);
    }
    if (avatar) {
        formData.append("avatar", avatar);
    } else {
        document.getElementById("avatar-error").textContent = "Please select an avatar";
        return;
    }
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    fetch('http://127.0.0.1:8000/clients/edit/', {
        method: 'PUT',
        headers: {
            'Authorization': `Token ${token}`, // Include the token if required for authentication
            'X-CSRFToken': csrfToken,
        },
        body: formData
    })
        .then(res => res.json())
        .then(data => {console.log(data)})
        .catch(error => console.error('Error:', error));
    
    alert('Profile updated successfully');
    window.location.href = 'profile.html';
};



loadClientId();
profileDetails();
gamingLibrary();
loadStreamsProfile();