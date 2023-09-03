//Zeke 2023

/* Michael Jackson's Discography:
- Got to Be There (1972), 10 songs
- Ben (1972), 10 songs
- Music & Me (1973), 10 songs
- Forever, Michael (1975), 10 songs
- Off the Wall (1979), 10 songs
- Thriller (1982), 9 songs
- Bad (1987), 10 songs (bonus song on CD realease aka 11 songs)
- Dangerous (1991), 14 songs
- HIStory: Past, Present and Future, Book 1 (1995), 30 songs (15 on each Disc)
- Invincible (2001), 16 songs
*/


class Artist { //creating Artist class
    constructor(artistName) {
        this.artistName = artistName;
        this.albums = [];
    }

    addAlbum(albumName) {
        this.albums.push(new Album(albumName));
    }
}

class Album { //creating Album class
    constructor(albumName) {
        this.albumName = albumName;
    }
}

//creating http requests send service through MockApi
class ArtistService {
    static url ='https://64f3f3a8932537f4051a0ad0.mockapi.io/Music_Catalog_API/Artists'; //using static methods to call on the class itself directly as it belongs to the class rather than an instance of said class

    static getAllArtists() {
        return $.get(this.url); //establishing GET aka Read in CRUD
    }

    static getArtist(id) {
        return $.get(this.url + `/${id}`);
    }

    static createArtist(artist) {
        return $.post(this.url, artist); //establishing POST aka Create in CRUD
    }

    //now ensuring that an id is assigned automatically by the API
    static updateArtist(artist) {
        return $.ajax({
            url: this.url  + `/${artist._id}`,
            dataType: 'json',
            data: JSON.stringify(artist),
            contentType: 'application/json',
            type: 'PUT' ////establishing PUT aka Update in CRUD
        });
    }

    static deleteArtist(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE' ////establishing DELETE aka Delete :) in CRUD
        });
    }
}

//establishing the rerendering of the DOM
class DOMManager {
    static artists;

    //with every return as seen above, using the .then() method to get the data and rerender the DOM
    static getAllArtists() {
        ArtistService.getAllArtists().then(artists => this.render(artists));
    }

    //creating new artist with updated data received from requests
    static createArtist(artistName) {
        ArtistService.createArtist(new Artist(artistName))
        .then(() => {
            return ArtistService.getAllArtists();
        })
        .then((artists) => this.render(artists));
    }

    static deleteArtist(id) {
        ArtistService.deleteArtist(id)
            .then(() => {
                return ArtistService.getAllArtists();
            })
            .then((artists) => this.render(artists));
    }

    static addAlbum(id) {
        for (let artist of this.artists) {
            if (artist._id == id) {
                artist.albums.push(new Album($(`#${artist._id}-album-name`).val()));
                ArtistService.updateArtist(artist)
                .then(() => {
                    return ArtistService.getAllArtists();
                })
                .then((artists) => this.render(artists));
            }
        }
    }

    static deleteAlbum(artistId, albumId) {
        for (let artist of this.artists) {
            if (artist._id == artistId) {
                for (let album of artist.albums) {
                    if (album._id == albumId) {
                        artist.albums.splice(artist.albums.indexOf(album), 1);
                        ArtistService.updateArtist(artist)
                            .then(() => {
                                return ArtistService.getAllArtists();
                            })
                            .then((artists) => this.render(artists));
                    }
                }
            }
        }
    }

    static render(artists) {
        this.artists = artists;
        $('#app').empty();
        for (let artist of artists) {
            $('#app').prepend(
               `<div id="${artist._id}" class="card">
                    <div class="card-header">
                        <h2>${artist.artistName}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteArtist('${artist._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${artist._id}-album-name" class="form-control" placeholder="Album Name">
                                </div>
                            </div>
                            <button id="${artist._id}-new-album" onclick="DOMManager.addAlbum('${artist._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>` 
            );
            for (let album of artist.albums) {
                console.log(artist);
                $(`#${artist._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${album._id}"><strong>Album Name: </strong> ${album.albumName}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteAlbum('${artist._id}', '${album._id}')">Delete Album</button>
                    >/p>`
                );
            }
        }
    }
}


$('#create-new-artist').click(() => {
    DOMManager.createArtist($('#new-artist-name').val());
    $('#new-artist-name').val('');
});

DOMManager.getAllArtists();








