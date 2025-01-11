const APIController = (function() {
    const clientId = "6bf16c53e11f4d18a718421a667daf80";
    const clientSecret = "22be960cc76542fba1bdb87a885f13b4";
    const redirectUri = "http://127.0.0.1:5500/index.html?";
    let accessToken = null;

    // Check if the user has been redirected from Spotify after authentication
    const _getTokenFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("code");
    };

    const _getToken = async () => {
        if (accessToken) {
            return accessToken; // Return the existing token if available
        }

        // Check if the authorization code is in the URL (i.e., if the user just came back from Spotify)
        const authCode = _getTokenFromUrl();
        if (authCode) {
            // Exchange the authorization code for an access token
            const token = await _exchangeCodeForToken(authCode);
            return token;
        }

        // If no token and no authorization code, redirect to Spotify authorization
        const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-library-read%20playlist-read-private%20playlist-read-collaborative`;
        window.location.href = authUrl;
    };

    const _exchangeCodeForToken = async (code) => {
        const redirectUri = "http://127.0.0.1:5500/index.html?"; // Make sure this matches the registered redirect URI
    
        const tokenRequestData = new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri
        }).toString();
    
        console.log("Token request data: ", tokenRequestData); // Log the request data
    
        try {
            const result = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
                },
                body: tokenRequestData
            });
    
            const data = await result.json();
            if (!result.ok) {
                console.error("Error retrieving token: ", data);  // Log the error details if the response is not ok
                return null;
            }
    
            accessToken = data.access_token;
            localStorage.setItem("spotify_access_token", accessToken);
            return accessToken;
        } catch (error) {
            console.error("Error exchanging code for token: ", error);
        }
    };
    

    const _getGenres = async (token) => {
        const result = await fetch("https://api.spotify.com/v1/browse/categories?locale=en_US", {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await result.json();
        return data.categories.items;
    };

    const _getUserPlaylists = async (token) => {
        const result = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        const data = await result.json();
        return data.items;
    };

    return {
        getToken() {
            return _getToken();
        },
        exchangeCodeForToken(code) {
            return _exchangeCodeForToken(code);
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getUserPlaylists(token) {
            return _getUserPlaylists(token);
        }
    }
})();

const UIController = (function() {
    const DOMElements = {
        selectGenre: "#select_genre",
        selectPlaylist: "#select_playlist",
        buttonSubmit: "#btn_submit",
        divSongDetail: "#song-detail", 
        hfToken: "#hidden_token",
        divSongList: ".song-list"
    };

    return {
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                play: document.querySelector(DOMElements.selectPlaylist),
                songs: document.querySelector(DOMElements.divSongList),
                submit: document.querySelector(DOMElements.buttonSubmit),   
                songDetail: document.querySelector(DOMElements.divSongDetail)
            };
        },

        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML("beforeend", html);
        },

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML("beforeend", html);
        },

        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSongList).insertAdjacentHTML("beforeend", html);
        },

        createTrackDetail(img, title, artist) {
            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            detailDiv.innerHTML = "";
            const html = `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">
            </div>
            <div class="row col-sm-12 px-0">
            <label for="select_genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
            <label for="artist" class="form-label col-sm-12">${artist}:</label>
            </div>
            `;
            detailDiv.insertAdjacentHTML("beforeend", html);
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = "";
        },

        resetTracks() {
            const songList = this.inputField().songs;
            if (songList) {
                songList.innerHTML = "";
            }
            this.resetTrackDetail();
        },
        
        resetPlaylist() {
            const playlist = this.inputField().play;
            if (playlist) {
                playlist.innerHTML = "";
            }
            this.resetTracks();
        }
    }
})();

const AppController = (function(UICtrl, APICtrl) {
    const DOMInputs = UICtrl.inputField();

    const loadGenres = async () => {
        try {
            const token = await APICtrl.getToken();
            if (!token) {
                console.error("Token retrieval failed.");
                return;
            }
            UICtrl.setStoredToken(token);

            const genres = await APICtrl.getGenres(token);
            genres.forEach(genre => {
                console.log(`Genre ID: ${genre.id}, Genre Name: ${genre.name}`);
                UICtrl.createGenre(genre.name, genre.id);
            });
        } catch (error) {
            console.error("Error loading genres:", error);
        }
    };

    const loadUserPlaylists = async () => {
        try {
            const token = await APICtrl.getToken();
            if (!token) {
                console.error("Token retrieval failed.");
                return;
            }

            const playlists = await APICtrl.getUserPlaylists(token);
            playlists.forEach(playlist => {
                console.log(`Playlist: ${playlist.name}`);
                UICtrl.createPlaylist(playlist.name, playlist.tracks.href);
            });
        } catch (error) {
            console.error("Error loading user playlists:", error);
        }
    };

    DOMInputs.genre.addEventListener("change", async () => {
        UICtrl.resetPlaylist();
        const token = UICtrl.getStoredToken();
        const genreSelect = UICtrl.inputField().genre;
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;
        const genres = await APICtrl.getGenres(token);
        const validGenre = genres.find(genre => genre.id === genreId);

        if (validGenre) {
            try {
                const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
                playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
            } catch (error) {
                console.error(`Error fetching playlists for genre ${validGenre.name}:`, error);
            }
        }
    });

    DOMInputs.submit.addEventListener("click", async (e) => {
        e.preventDefault();
        UICtrl.resetTracks();
        const token = UICtrl.getStoredToken();
        const playlistSelect = UICtrl.inputField().playlist;
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        tracks.forEach(t => UICtrl.createTrack(t.track.href, t.track.name));
    });

    return {
        init() {
            console.log("App is starting");
            loadGenres();
            loadUserPlaylists();  // Load user playlists
        }
    }
})(UIController, APIController);

AppController.init();
