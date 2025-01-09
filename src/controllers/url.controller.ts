import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { Router } from "express";
import UrlService from "../services/url.service";
// Cookie Options for Security. Add Additional if necessary
const cookie_options = {
  httpOnly: true,
  secure: true,
};

const createShortUrl = asyncHandler(async (req, res) => {
  try {
    // Write a Controller for creating a new Url Generator using the Provided schema
    const { redirect_url } = req.body;
    if (!redirect_url) {
      throw new Error("Redirect Url not found in the Request Body");
    }
    const CreateUrl = await UrlService.insert(redirect_url);
    return res
      .status(201)
      .cookie("Created_Url", CreateUrl, cookie_options)
      .json(new ApiResponse(201, CreateUrl, "Url is Created Successfully"));
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(
        400,
        error?.message || "Something went wrong when creating Short "
      );
    } else {
      throw new ApiError(
        500,
        "Something Went wrong. Please try again after sometime."
      );
    }
  }
});

const getShortUrl = asyncHandler(async (req, res) => {
  try {
    const { shortUrl } = req.params;
    if (!shortUrl) {
      throw new Error("Short Url Id is NOT found in the Parameters");
    }
    const getAndUpdateUrlData = await UrlService.findAndUpdate(shortUrl);
    if (!getAndUpdateUrlData) {
      throw new Error(
        "Url details could not be found. Please check the request again"
      );
    }
    return res.status(302).redirect(getAndUpdateUrlData.redirect_url);
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(
        400,
        error?.message || "Something went wrong when getting Short Url Data "
      );
    } else {
      throw new ApiError(
        500,
        "Something Went wrong. Please try again after sometime."
      );
    }
  }
});

const getShortUrlData = asyncHandler(async (req, res) => {
  try {
    const { shortUrl } = req.params;
    if (!shortUrl) {
      throw new Error("Short Url Id is NOT found in the Parameters");
    }
    const getAndUpdateUrlData = await UrlService.findAndUpdate(shortUrl);

    if (!getAndUpdateUrlData) {
      throw new Error(
        "Url details could not be found. Please check the request again"
      );
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          getAndUpdateUrlData,
          "Url Data is fetched Successfully"
        )
      );
  } catch (error) {}
});

export { createShortUrl, getShortUrl, getShortUrlData };
