'use strict';


let movie = {
    title: '',
    rating: 0
};


let list_of_movies = [
    {
        title: 'The Shawshank Redemption',
        rating: 9.3
    },
    {
        title: 'The Godfather',
        rating: 9.2
    },
    {
        title: 'The Dark Knight',
        rating: 9.0
    }];

function addMovie(movie, rating){
    list_of_movies.push({
        title: movie,
        rating: rating
    });
}

function displayMovies(){
    let moviesList = document.getElementById('movies-list');
    moviesList.innerHTML = '';
    list_of_movies.forEach(movie => {
        let listItem = document.createElement('li');
        listItem.textContent = `${movie.title} - Rating: ${movie.rating}`;
        moviesList.appendChild(listItem);
    });
}


function sortMoviesByRatingAscending(){
    list_of_movies.sort((a, b) => b.rating - a.rating);
}

function sortMoviesByRatingDescending(){
    list_of_movies.sort((a, b) => a.rating - b.rating);
}

displayMovies();
sortMoviesByRatingDescending();

document.getElementById('sort-asc').addEventListener('click', function() {
    sortMoviesByRatingAscending();
    displayMovies();
});

document.getElementById('sort-desc').addEventListener('click', function() {
    sortMoviesByRatingDescending();
    displayMovies();
});


document.getElementById('add-movie-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let movieTitle = document.getElementById('movie-title').value;
    let movieRating = parseFloat(document.getElementById('movie-rating').value);
    if(movieTitle && !isNaN(movieRating)){
        addMovie(movieTitle, movieRating);
        displayMovies();
        document.getElementById('movie-title').value = '';
        document.getElementById('movie-rating').value = '';
    }
});
