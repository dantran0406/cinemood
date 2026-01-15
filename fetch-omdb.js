const fs = require("fs");

const API_KEY = "976c3e73";
//Choix du film
const movieTitles = [
  "Inception",
  "The Matrix",
  "Interstellar",
  "The Dark Knight",
  "Parasite",
  "Joker",
  "Titanic",
  "Forrest Gump",
  "The Shawshank Redemption",
  "La La Land",
  "Her",
  "Coco",
  "Spirited Away",
  "Avengers: Endgame",
  "Iron Man",
  "Get Out",
  "A Quiet Place",
  "Alien",
  "The Godfather",
  "Pulp Fiction",
  "Fight Club",
  "Whiplash",
  "Black Swan",
  "The Social Network",
  "Blade Runner 2049",
  "Dune",
  "Arrival",
  "The Grand Budapest Hotel",
  "Toy Story",
  "Up",
  "The Lion King",
  "Tangled",
  "Gladiator",
  "Mad Max: Fury Road",
  "The Lord of the Rings: The Fellowship of the Ring", 
  "The Lord of the Rings: The Two Towers",
  "The Lord of the Rings: The Return of the King",
  "Harry Potter and the Sorcerer's Stone",
  "Harry Potter and the Prisoner of Azkaban",
  "Pirates of the Caribbean: The Curse of the Black Pearl",
  "Jurassic Park",
  "Star Wars: A New Hope",
  "Star Wars: The Empire Strikes Back",
  "Star Wars: Return of the Jedi",
  "Inside Out",
  "Finding Nemo",
  "Monsters, Inc.",
  "Shrek",
  "The Hangover",
  "Deadpool",
  "The Silence of the Lambs",
  "Se7en",
  "Me Before You",
  "Mulan",
  "My Neighbor Totoro",
  "Howl's Moving Castle"
];

//L'étiquette de l'émotion de film
function detectEmotion(genre) {
  if (!genre) return "Null";

  const g = genre.toLowerCase();

  if (g.includes("horror") || g.includes("thriller")) return "Horrible";
  if (g.includes("drama") || g.includes("romance")) return "Romance";
  if (g.includes("animation") || g.includes("family") || g.includes("comedy")) return "Comédie";
  if (g.includes("action") || g.includes("sci-fi") || g.includes("crime")) return "Action";

  return "Null";
}

// ==========================
// 3. FETCH OMDB → JSON
// ==========================
async function fetchMovies() {
  const results = [];

  for (const title of movieTitles) {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`;
    const res = await fetch(url);
    const d = await res.json();

    if (d.Response === "True") {
      const rotten = d.Ratings?.find(r => r.Source === "Rotten Tomatoes");

      results.push({
        title: d.Title,
        year: Number(d.Year),
        genre: d.Genre,
        imdb: Number(d.imdbRating),
        rotten: rotten ? parseInt(rotten.Value) : null,
        emotion: detectEmotion(d.Genre),
        personal: Math.round(Number(d.imdbRating)), // tự gán theo imdb
        poster: d.Poster !== "N/A" ? d.Poster : "https://via.placeholder.com/300x450?text=No+Poster"
      });

      console.log("✔", d.Title);
    } else {
      console.log("✖ On ne sait pas", title);
    }
  }

  fs.writeFileSync("movies.json", JSON.stringify(results, null, 2));
  console.log("🎉 movies.json created with", results.length, "movies");
}

fetchMovies();
