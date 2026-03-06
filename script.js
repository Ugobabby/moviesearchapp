const APIKEY = "f6a62906"
const input = document.querySelector("#movie-input")
const btn = document.querySelector("#btn")
const result = document.querySelector("#movie-result")

btn.addEventListener("click", searchMovie)

async function searchMovie() {
  const movieName = input.value.trim();
  if (movieName === ""){
    result.innerHtml = "<p>Please enter a Movie Name</p>";
    return;
  }

  const url = `https://www.omdbapi.com/?t=${movieName}&apikey=${APIKEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if(data.Response == "false"){
    result.innerHtml = "<p>Movie Not Found </p>";
    return;
  }
  result.innerHTML = `
    <img src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/300"}" />
    <h3>${data.Title} (${data.Year})</h3>
    <p><b>Rating:</b> ${data.imdbRating}</p>
    <p><b>Genre:</b> ${data.Genre}</p>
    <p><b>Runtime:</b> ${data.Runtime}</p>
    <p><b>Plot:</b> ${data.Plot}</p>
  `
  // console.log(data)
}


