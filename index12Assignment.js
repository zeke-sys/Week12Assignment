//Zeke 2023

class Festival { //creating Festival class
    constructor(name, date) {
        this.name = name;
        this.date = date;
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
    static url ='https://64f3f3a8932537f4051a0ad0.mockapi.io/Festivals_API/festivals'; //using static methods to call on the class itself directly as it belongs to the class rather than an instance of said class

    static createFestival(festival) {
        return $.post(this.url, festival); //establishing POST aka Create in CRUD
    }
    static getAllFestivals() {
        return $.get(this.url); //establishing GET aka Read in CRUD
    }

    static getFestival(id) {
        return $.get(this.url + `/${id}`);
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

//establishing rerendering of the DOM
class DOMManager {
    static festivals;

    //with every return as seen above, using the .then() method to get the data and rerender the DOM
    static getAllFestivals() {
        FestivalService.getAllFestivals().then(festivals => this.render(festivals));
    }

    //creating new artist with updated data received from theS requests
    static createFestival(name, date) {
        FestivalService.createFestival(new Festival(name, date))
        .then(() => {
            return FestivalService.getAllFestivals();
        })
        .then((festivals) => this.render(festivals));
    }
//Not really sure why my festivals and artists are not deleting. Will need to reach back out to a mentor.
//requests are meant to be sent to delete each rendition of festival and return updated festival array, and then render all festivals with updated data
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
                console.log(this.festivals);
                console.log(this.festival);
                festival.artists.push(new Artist($(`#${festival._id}-artist-name`).val(), $(`#${festival._id}-artist-duration`).val()));
                console.log(festival.artists);
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
        $('#app').empty(); //using empty here so it can clear every time the app is rendered
        for (let festival of festivals) { //for loop here to render each and every festival
            console.log(festival); //troubleshooting purposes
            $('#app').prepend( //preprend so each festival is placed on top
               `<div id="${festival._id}" class="card">
                    <div class="card-header">
                        <h2>${festival.name} on ${festival.date}</h2>
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
                </div><br>` //end to template literal
            ); //end to preprend

            //nested for loop to render the data from festival
            for (let artist of festival.artists) {
                console.log(festival);
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
    DOMManager.createFestival($('#new-festival-name').val(), $('#new-festival-date').val());
    $('#new-festival-name').val('');
    $('#new-festival-date').val('');
});

DOMManager.getAllFestivals();








