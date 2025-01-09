import { Router } from "express";
import {
  createShortUrl,
  getShortUrl,
  getShortUrlData,
} from "../controllers/url.controller";
const router = Router();

router.route("/").post(createShortUrl);
router.route("/:shortUrl").get(getShortUrl);
router.route("/analytics/:shortUrl").get(getShortUrlData);

export default router;
