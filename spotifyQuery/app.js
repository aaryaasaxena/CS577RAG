const APIController = (function() {

    const cliendId = "";
    const clientSecret = "";


    // private methods
    const _getToken = async () => {
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",    
                "Authorizatiob": "Basic " + btoa(clientId + ":" + clientSecret)
            },
            body: "grant_type=client_credentials"
        });
        
        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {
        const result = await fetch("https://api.spotify.com/v1/browse/categories?locale=sv_US", {
            method: "GET",
            headers: { "Aurhorization": "Bearer " + token }
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 10;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: "GET",
            headers: { "Aurhorization": "Bearer " + token }
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: "GET",
            headers: { "Aurhorization": "Bearer " + token }
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {
        const limit = 10;

        const result = await fetch(`${trackEndPoint}`, {
            method: "GET",
            headers: { "Aurhorization": "Bearer " + token }
        });

        const data = await result.json();
        return data.items;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(){
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId){
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint){
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint){
            return _getTrack(token, trackEndPoint);
        }

    }
        

})();


// UI Module
const UIController = (function() {

    const DOMElements = {
        selectGenre: "#select_genre",
        selectPlaylist: "#select_playlist",
        buttonSubmit: "#btn_submit",
        divSongDetail: "#song-detail", 
        hfToken: "#hidden_token",
        divSongList: ".song-list"
    }

    // public methods
    return {

        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                play: document.querySelector(DOMElements.selectPlaylist),
                songs: document.querySelector(DOMElements.divSongList),
                submit: document.querySelector(DOMElements.buttonSubmit),   
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // need methods to create select list option
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML("beforeend", html);
        },

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML("beforeend", html);
        },

        // need method to create track list group item
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSongList).insertAdjacentHTML("beforeend", html);

        },


        // need method to create the song detail
        createSongDetail(img, title, artist) {
            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // anytime user clicks a new song, we need to clear the song detail div
            detailDiv.innerHTML = "";

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">
            </div>
            <div class="row col-sm-12 px-0">
            <label for="Genre" class="form-label col-sm-12">${title}:</label>
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
            this.inputField().songs.innerHTML = "";
            this.resetTrackDetail();
        },
        resetPlaylist() {
            this.inputField().play.innerHTML = "";
            this.resetTracks();
        }
    }
})();
