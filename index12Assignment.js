//Zeke 2023

class Festival { //creating Festival class
    constructor(name) {
        this.name = name;
        this.artists = [];
    }

    addArtist(name, duration) {
        this.artists.push(new Artist(name, duration));
    }
}

class Artist { //creating Artist class
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
    }
}

//creating http requests send service through MockApi
class FestivalService {
    static url ='https://64f3f3a8932537f4051a0ad0.mockapi.io/Festivals_API/Festivals'; //using static methods to call on the class itself directly as it belongs to the class rather than an instance of said class

    static getAllFestivals() {
        return $.get(this.url); //establishing GET aka Read in CRUD
    }

    static getFestival(id) {
        return $.get(this.url + `/${id}`);
    }

    static createFestival(festival) {
        return $.post(this.url, festival); //establishing POST aka Create in CRUD
    }

    //now ensuring that an id is assigned automatically by the API
    static updateFestival(festival) {
        return $.ajax({
            url: this.url  + `/${festival._id}`,
            dataType: 'json',
            data: JSON.stringify(festival),
            contentType: 'application/json',
            type: 'PUT' //establishing PUT aka Update in CRUD
        });
    }

    static deleteFestival(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE' //establishing DELETE aka Delete :) in CRUD
        });
    }
}

//establishing the rerendering of the DOM
class DOMManager {
    static festivals;

    //with every return as seen above, using the .then() method to get the data and rerender the DOM
    static getAllFestivals() {
        FestivalService.getAllFestivals().then(festivals => this.render(festivals));
    }

    //creating new artist with updated data received from requests
    static createFestival(name) {
        FestivalService.createFestival(new Festival(name))
        .then(() => {
            return FestivalService.getAllFestivals();
        })
        .then((festivals) => this.render(festivals));
    }

    static deleteFestival(id) {
        FestivalService.deleteFestival(id)
            .then(() => {
                return FestivalService.getAllFestivals();
            })
            .then((festivals) => this.render(festivals));
    }

    static addArtist(id) {
        for (let festival of this.festivals) {
            if (festival._id == id) {
                festival.artists.push(new Artist($(`#${festival._id}-artist-name`).val(), $(`#${festival._id}-artist-duration`).val()));
                FestivalService.updateFestival(festival)
                .then(() => {
                    return FestivalService.getAllFestivals();
                })
                .then((festivals) => this.render(festivals));
            }
        }
    }

    static deleteArtist(festivalId, artistId) {
        for (let festival of this.festivals) {
            if (festival._id == festivalId) {
                for (let artist of festival.artists) {
                    if (artist._id == artistId) {
                        festival.artists.splice(festival.artists.indexOf(artist), 1);
                        FestivalService.updateFestival(festival)
                            .then(() => {
                                return FestivalService.getAllFestivals();
                            })
                            .then((festivals) => this.render(festivals));
                    }
                }
            }
        }
    }

    static render(festivals) {
        this.festivals = festivals;
        $('#app').empty();
        for (let festival of festivals) {
            $('#app').prepend(
               `<div id="${festival._id}" class="card">
                    <div class="card-header">
                        <h2>${festival.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteFestival('${festival._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${festival._id}-artist-name" class="form-control" placeholder="Artist Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${festival._id}-artist-duration" class="form-control" placeholder="Performance Duration">
                                </div>
                            </div>
                            <button id="${festival._id}-new-artist" onclick="DOMManager.addArtist('${festival._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>` 
            );
            for (let artist of festival.artists) {
                $(`#${festival._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${artist._id}"><strong>Name: </strong> ${artist.name}</span>
                        <span id="duration-${artist._id}"><strong>Duration: </strong> ${artist.duration}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteArtist('${festival._id}', '${artist._id}')">Delete Artist</button>
                    </p>`
                );
            }
        }
    }
}


$('#create-new-festival').click(() => {
    DOMManager.createFestival($('#new-festival-name').val());
    $('#new-festival-name').val('');
});

DOMManager.getAllFestivals();








