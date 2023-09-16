const knex = require("../db/connection");

function read(reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .then((data) => data[0]);
}

function update(updatedReview) {
  knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then((data) => data[0]);

  return knex("reviews as r")
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
    .where({ review_id: updatedReview.review_id })
    .then((data) => {
      const reviewObj = data[0];
      const {
        preferred_name,
        surname,
        organization_name,
        created_atB,
        updated_atB,
        ...rest
      } = reviewObj;
      const newReviewObj = {
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
      return newReviewObj;
    });
}

function destroy(review_id) {
    return knex("reviews").where({ review_id }).del();
}

module.exports = {
  read,
  update,
  delete: destroy,
};
