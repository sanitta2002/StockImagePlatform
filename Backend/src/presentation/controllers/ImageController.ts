import { BulkUploadImagesRequestDTO } from "@/application/dtos/image/req/BulkUploadImagesRequestDTO";
import { HTTP_STATUS } from "@/domain/constants/HttpStatus";
import { IMAGE_MESSAGE } from "@/domain/constants/Messages";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IBulkUploadImagesUseCase } from "@/application/interfaces/Image/IBulkUploadImagesUseCase";
import { IGetImagesUseCase } from "@/application/interfaces/Image/IGetImagesUseCase";
import { IUpdateImageUseCase } from "@/application/interfaces/Image/IUpdateImageUseCase";
import { IDeleteImageUseCase } from "@/application/interfaces/Image/IDeleteImageUseCase";
import { IReorderImagesUseCase } from "@/application/interfaces/Image/IReorderImagesUseCase";

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
  stream: import('stream').Readable;
}

interface AuthenticatedRequest extends Request {
  user?: { id: string };
  files?: MulterFile[];
  file?: MulterFile;
}

@injectable()
export class ImageController {
  constructor(
    @inject("IBulkUploadImagesUseCase")
    private _bulkUploadImagesUseCase: IBulkUploadImagesUseCase,
    @inject("IGetImagesUseCase")
    private _getImagesUseCase: IGetImagesUseCase,
    @inject("IUpdateImageUseCase")
    private _updateImageUseCase: IUpdateImageUseCase,
    @inject("IDeleteImageUseCase")
    private _deleteImageUseCase: IDeleteImageUseCase,
    @inject("IReorderImagesUseCase")
    private _reorderImagesUseCase: IReorderImagesUseCase,
  ) {}

  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const files = authReq.files;
      if (!files || files.length === 0) {
        throw new Error(IMAGE_MESSAGE.AT_LEAST_ONE_IMAGE_REQUIRED);
      }
      
      let titles: string[] = [];
      if (req.body.titles) {
        titles = Array.isArray(req.body.titles) ? req.body.titles : JSON.parse(req.body.titles);
      }

      if (titles.length !== files.length) {
        throw new Error(IMAGE_MESSAGE.TITLES_MUST_MATCH_IMAGES);
      }
      
      const images = files.map((file, index) => ({
        title: titles[index]!,
        imageUrl: file.path,
      }));

      const dto: BulkUploadImagesRequestDTO = {
        userId: req.body.userId || authReq.user?.id, 
        images: images,
      };

      if (!dto.userId) {
         throw new Error(IMAGE_MESSAGE.USER_ID_REQUIRED);
      }

      const result = await this._bulkUploadImagesUseCase.execute(dto);
      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: IMAGE_MESSAGE.IMAGE_UPLOADED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = (req.query.userId as string) || req.body.userId || authReq.user?.id;
      if (!userId) {
         throw new Error(IMAGE_MESSAGE.USER_ID_REQUIRED);
      }
      const images = await this._getImagesUseCase.execute(userId);
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: images,
      });
    } catch (error) {
      next(error);
    }
  };

  updateImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const authReq = req as AuthenticatedRequest;
      const userId = req.body.userId || authReq.user?.id;
      const { title } = req.body;
      let imageUrl;
      
      const file = authReq.file;
      if (file) {
        imageUrl = file.path;
      }

      if (!userId || !id || !title) {
        throw new Error(IMAGE_MESSAGE.USER_ID_IMAGE_ID_TITLE_REQUIRED);
      }

      const result = await this._updateImageUseCase.execute({
        imageId: id,
        userId,
        title,
        ...(imageUrl && { imageUrl }),
      });

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: IMAGE_MESSAGE.IMAGE_UPDATED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const authReq = req as AuthenticatedRequest;
      const userId = req.body.userId || authReq.user?.id;
      
      if (!userId || !id) {
        throw new Error(IMAGE_MESSAGE.USER_ID_IMAGE_ID_REQUIRED);
      }

      await this._deleteImageUseCase.execute(id, userId);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: IMAGE_MESSAGE.IMAGE_DELETED,
      });
    } catch (error) {
      next(error);
    }
  };

  reorderImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = req.body.userId || authReq.user?.id;
      const { items } = req.body;
      
      if (!userId || !items || !Array.isArray(items)) {
        throw new Error(IMAGE_MESSAGE.USER_ID_ITEMS_REQUIRED);
      }

      await this._reorderImagesUseCase.execute(userId, items);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: IMAGE_MESSAGE.IMAGES_REORDERED,
      });
    } catch (error) {
      next(error);
    }
  };
}
