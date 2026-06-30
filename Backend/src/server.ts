import "reflect-metadata";
import "./infrastructure/di";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./infrastructure/database/mongodb";
import { authRouter } from "./presentation/routes/AuthRoutes";
import { AUTH_ROUTES, IMAGE_ROUTES } from "./domain/constants/Routes";

import { env } from "./config/envValidation";
import { errorHandler } from "./presentation/middleware/errorMiddleware";
import { imageRouter } from "./presentation/routes/ImageRoutes";

const app = express();

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());

connectToDatabase();

app.use(AUTH_ROUTES.BASE, authRouter);
app.use(IMAGE_ROUTES.BASE, imageRouter);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
