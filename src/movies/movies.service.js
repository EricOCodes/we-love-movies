const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

function list() {
  return knex("movies").select("*");
}

function listShowing(isShowing) {
  return knex("movies as m")
    .join("movies_theaters as t", "m.movie_id", "t.movie_id")
    .distinct("m.*")
    .where({ "t.is_showing": isShowing })
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function movieInTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "mt.*")
    .where({ "m.movie_id": movieId });
}

function movieReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.*",
      "c.critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at as created_atB",
      "c.updated_at as updated_atB"
    )
    .where({ "m.movie_id": movieId })
    .then((data) => {
      let withCriticObj = [];
      for (let i = 0; i < data.length; i++) {
        const reviewObj = data[i];
        const {
          preferred_name,
          surname,
          organization_name,
          created_atB,
          updated_atB,
          ...rest
        } = reviewObj;
        const trial = {
          ...rest,
          critic: {
            critic_id: reviewObj.critic_id,
            preferred_name: reviewObj.preferred_name,
            surname: reviewObj.surname,
            organization_name: reviewObj.organization_name,
            created_at: reviewObj.created_atB,
            updated_at: reviewObj.updated_atB,
          },
        };
        withCriticObj.push(trial);
      }
      return withCriticObj;
    });
}

module.exports = {
  list,
  listShowing,
  read,
  movieInTheaters,
  movieReviews,
};
