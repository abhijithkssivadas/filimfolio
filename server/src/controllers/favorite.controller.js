import responseHandler from "../handlers/response.handler.js";
import favoriteModel from "../models/favorite.model.js";

const addFavorite = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);         // Check if user is present
    console.log("REQ.BODY:", req.body);         // Check body data

    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (isFavorite) {
      console.log("Already favorited");
      return responseHandler.ok(res, isFavorite);
    }

    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id
    });

    await favorite.save().catch(err => {
      console.error("SAVE ERROR:", err);
      return responseHandler.error(res); // Exit early on error
    });

    console.log("Favorite saved:", favorite);
    responseHandler.created(res, favorite);
  } catch (err) {
    console.error("ADD FAVORITE ERROR:", err);
    responseHandler.error(res);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await favoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId
    });

    if (!favorite) {
      console.log("Favorite not found for deletion");
      return responseHandler.notfound(res);
    }

    await favorite.remove();

    console.log("Favorite removed:", favoriteId);
    responseHandler.ok(res);
  } catch (err) {
    console.error("REMOVE FAVORITE ERROR:", err);
    responseHandler.error(res);
  }
};

const getFavoritesOfUser = async (req, res) => {
  try {
    const favorite = await favoriteModel.find({ user: req.user.id }).sort("-createdAt");

    console.log("User favorites fetched:", favorite.length);
    responseHandler.ok(res, favorite);
  } catch (err) {
    console.error("GET FAVORITES ERROR:", err);
    responseHandler.error(res);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };
