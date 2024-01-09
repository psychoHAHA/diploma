const movie = require('../models/movie')
const ErrorNotFound = require('../errors/errorNotFound')
const ErrorValidation = require('../errors/errorValidation')
const ErrorForbiden = require('../errors/errorForbidden')

const getMovies = async (req, res, next) => {
  try {
    const movies = await movie.find({ owner: req.user._id })
    if (!movies) {
      throw new ErrorNotFound('Фильм не найден')
    }

    res.send(movies)
  } catch (error) {
    next(error)
  }
}

const createMovie = async (req, res, next) => {
  try {
    const owner = await req.user._id
    const creatingMovie = await movie.create({ owner, ...req.body })

    res.send(creatingMovie)
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ErrorValidation('Ошибка валидации полей')
    } else {
      next(error)
    }
  }
}

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params

  movie
    .findById(movieId)
    .orFail(() => {
      throw new ErrorNotFound('Фильм с таким ID не найден')
    })
    .then((movie) => {
      if (movie.owner.toString() === userId) {
        return movie
          .deleteOne(movieId)
          .then((delMovie) => res.send(delMovie))
          .catch(next)
      }
      throw new ErrorForbiden('Вы не можете это сделать')
    })
    .catch(next)
}

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
}
