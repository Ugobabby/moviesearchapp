const APIKEY = "f6a62906";
const input = document.querySelector("#movie-input");
const btn = document.querySelector("#btn");
const movieRows = document.querySelector("#movie-rows");

btn.addEventListener("click", searchMovie);
input.addEventListener("keypress", e => { if(e.key === "Enter") searchMovie(); });

async function searchMovie() {
  const movieName = input.value.trim();
  if (!movieName) {
    movieRows.innerHTML = "<p>Please enter a movie name</p>";
    return;
  }

  const searchUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(movieName)}&apikey=${APIKEY}`;

  try {
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.Response === "False") {
      movieRows.innerHTML = "<p>Movie Not Found</p>";
      return;
    }

    movieRows.innerHTML = ""; // clear previous rows

    // Split results into "rows" of 5 movies each
    const moviesPerRow = 5;
    for (let i = 0; i < data.Search.length; i += moviesPerRow) {
      const rowMovies = data.Search.slice(i, i + moviesPerRow);

      const rowDiv = document.createElement("div");
      rowDiv.classList.add("movie-row");

      const rowTitle = document.createElement("h2");
      rowTitle.textContent = `Results ${i + 1} - ${Math.min(i + moviesPerRow, data.Search.length)}`;
      rowDiv.appendChild(rowTitle);

      const moviesContainer = document.createElement("div");
      moviesContainer.classList.add("movies-container");

      for (const movie of rowMovies) {
        const detailsRes = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(movie.Title)}&apikey=${APIKEY}`);
        const details = await detailsRes.json();

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-box");
        movieCard.innerHTML = `
          <img src="${details.Poster !== "N/A" ? details.Poster : 'https://via.placeholder.com/300'}" />
          <h3>${details.Title} (${details.Year})</h3>
          <p><b>Rating:</b> ${details.imdbRating}</p>
          <p><b>Genre:</b> ${details.Genre}</p>
          <p><b>Runtime:</b> ${details.Runtime}</p>
          <p><b>Plot:</b> ${details.Plot}</p>
          <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(details.Title + ' trailer')}" target="_blank" class="watch-btn">Watch Trailer</a>
          <a href="https://www.google.com/search?q=${encodeURIComponent(details.Title + ' full movie online')}" target="_blank" class="watch-btn">Search Online</a>
        `;
        moviesContainer.appendChild(movieCard);
      }

      rowDiv.appendChild(moviesContainer);
      movieRows.appendChild(rowDiv);
    }

  } catch(err) {
    movieRows.innerHTML = "<p>Error fetching movie data</p>";
    console.error(err);
  }
}