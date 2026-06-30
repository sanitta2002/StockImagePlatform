import { Router } from "express";
import { container } from "tsyringe";
import { ImageController } from "@/presentation/controllers/ImageController";
import { upload } from "../middleware/MulterMiddleware";
import { IMAGE_ROUTES } from "@/domain/constants/Routes";

const imageRouter = Router();

const imageController = container.resolve(ImageController);

imageRouter.post(
  IMAGE_ROUTES.UPLOAD,
  upload.array("image"),
  imageController.uploadImage,
);

imageRouter.get(IMAGE_ROUTES.GET_ALL, imageController.getImages);

imageRouter.put(
  IMAGE_ROUTES.UPDATE,
  upload.single("image"),
  imageController.updateImage,
);

imageRouter.delete(IMAGE_ROUTES.DELETE, imageController.deleteImage);

imageRouter.patch(IMAGE_ROUTES.REORDER, imageController.reorderImages);

export { imageRouter };
