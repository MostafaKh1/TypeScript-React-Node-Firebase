import express from "express";
import {
  addImage,
  getImagesLinks,
  updateImageLink,
  deleteImageLink
} from "../controllers/image";

const router = express.Router();

router.post("/", addImage);
router.get("/", getImagesLinks);
router.put("/:id", updateImageLink);
router.delete("/:id", deleteImageLink);

export default router;
