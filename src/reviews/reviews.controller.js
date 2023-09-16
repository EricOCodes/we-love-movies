const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const review = await reviewsService.read(req.params.reviewId);
    if (review) {
        res.locals.review = review;
        return next();
    }
    next({
        status: 404,
        message: "Review cannot be found."
    })
}

function read(req, res) {
    res.json({ data: res.locals.review });
}

async function update(req, res) {
    console.log(req.body.review)
    const updatedReview = {
        ...res.locals.review,
        ...req.body.data,
        review_id: res.locals.review.review_id,
    };
    const data = await reviewsService.update(updatedReview);
    res.json({ data })
}

async function destroy(req, res) {
    const { review } = res.locals;
    await reviewsService.delete(review.review_id);
    res.sendStatus(204);
}

module.exports = {
    read: [
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(read)
    ],
    update: [
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(update)
    ],
    delete: [
        asyncErrorBoundary(reviewExists),
        asyncErrorBoundary(destroy)
    ]
}