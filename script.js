const API_KEY = 'api_key=e9e711eeaf3cc8453e315b659d8f3880';
const BASE_URL= 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/trending/movie/day?' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const SEARCH_ENDPOINT = '/search/movie';
const FAVORITE_ENDPOINT = '/account/20673641/favorite/movies';

const account_id = '20673641';

const DISCOVER_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;

const trending = document.getElementById('trending');

const input = document.querySelector('.search input');
const searchButton = document.querySelector('.search button');

const favoriteButton = document.querySelector('.fav-btn');

const getOptions = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWU3MTFlZWFmM2NjODQ1M2UzMTViNjU5ZDhmMzg4MCIsInN1YiI6IjY1NDlkYzc1Mjg2NmZhMDBlMWYwNjg0MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._C0rxOOxkhFQR6bxSBpw0hvtUE6sUtAcnOQZOqPW-eY',
    }
};


const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
];

const tagsElement = document.getElementById('genres-tags');

var selectGenre = [];

setGenre()
function setGenre() {
    tagsElement.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        
        t.addEventListener('click', () => {
            const index = selectGenre.indexOf(genre.id);

            if (index !== -1) {
                // Genre is already selected, remove it
                selectGenre.splice(index, 1);
            } else {
                // Genre is not selected, add it
                selectGenre.push(genre.id);
            }
            console.log(selectGenre)

            getMovies(DISCOVER_URL + '&with_genres=' + selectGenre.join(','))
        });

        tagsElement.append(t);
    })
}


favoriteButton.addEventListener('click', function () {
    const FAV_URL = `${BASE_URL}${FAVORITE_ENDPOINT}?${API_KEY}&language=en-US&page=1&sort_by=created_at.asc`;
    getMovies(FAV_URL);
})

searchButton.addEventListener('click', function () {
    const searchTerm = input.value.trim();

    if (searchTerm !== '') {
        const SEARCH_URL = `${BASE_URL}${SEARCH_ENDPOINT}?${API_KEY}&query=${searchTerm}`;

        getMovies(SEARCH_URL);
    }
});


getMovies(API_URL)
function getMovies(url) {
    fetch(url, getOptions).then(response => response.json())
    .then(data => {
        showMovies(data.results)
    })
}

function showMovies(data) {
    trending.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, overview, id} = movie;
        const movieElement = document.createElement('div')
        movieElement.classList.add('movie')
        movieElement.innerHTML = `
            <button class="add-favorite-btn" data-movie-id="${id}">Favorite</button>

            <img src="${IMG_URL + poster_path}" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
            </div>

            <div class="overview">
                ${overview}
            </div>
        `

        const addFavoriteBtn = movieElement.querySelector('.add-favorite-btn');
        addFavoriteBtn.addEventListener('click', () => {
            const movieId = addFavoriteBtn.getAttribute('data-movie-id');
            addMovieToFavorites(movieId);
        });

        trending.appendChild(movieElement)
    });
}

function addMovieToFavorites(movieId) {
    const FAVORITE_URL = `${BASE_URL}/account/20673641/favorite?${API_KEY}`;

    const requestBody = {
        media_type: 'movie',
        media_id: movieId,
        favorite: true,
    };

    const postOptions = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOWU3MTFlZWFmM2NjODQ1M2UzMTViNjU5ZDhmMzg4MCIsInN1YiI6IjY1NDlkYzc1Mjg2NmZhMDBlMWYwNjg0MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._C0rxOOxkhFQR6bxSBpw0hvtUE6sUtAcnOQZOqPW-eY'
          },
        body: JSON.stringify(requestBody),
    };

    fetch(FAVORITE_URL, postOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Movie added to favorites:', data);
        })
}



