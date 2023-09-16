const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
    const movie = await moviesService.read(req.params.movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    next({
        status: 404,
        message: `Movie cannot be found.`
    });
}

function read(req, res) {
    res.json({ data: res.locals.movie });
    

}

async function movieInTheaters(req, res) {
    console.log(req.params.movieId)
    res.json({ data: await moviesService.movieInTheaters(req.params.movieId) });
}

async function movieReviews(req, res) {
    res.json({ data: await moviesService.movieReviews(req.params.movieId) });
}

async function list(req, res, next) {
    try {
        if (req.query.is_showing) {
            const isShowing = true;
            const data = await moviesService.listShowing(isShowing);
            res.json({ data });
        } else {
            
            const data = await moviesService.list();
            res.json({ data });
        }
    } catch (error) {
        next(error);
    }
}


module.exports = {
    read: [
        asyncErrorBoundary(movieExists),
        asyncErrorBoundary(read)
    ],
    movieInTheaters: [
        asyncErrorBoundary(movieExists),
        asyncErrorBoundary(movieInTheaters),
    ],
    movieReviews: [
        asyncErrorBoundary(movieExists),
        asyncErrorBoundary(movieReviews)
    ],
    list: [asyncErrorBoundary(list)],
}