const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
  created_at_m: ["movies", null, "created_at"],
  updated_at_m: ["movies", null, "updated_at"],
  is_showing: ["movies", null, "is_showing"],
  theater_id_mt: ["movies", null, "theater_id"],
});

function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select(
      "t.*",
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url",
      "m.created_at as created_at_m",
      "m.updated_at as updated_at_m",
      "mt.*",
      "mt.theater_id as theater_id_mt"
    )
    .then((data) => {
      return reduceMovies(data, null, 4);
    });
}

module.exports = {
  list,
};
