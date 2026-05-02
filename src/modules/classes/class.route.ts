import { Router } from "express";
import { authenticate, validateRequestBody } from "../../middlewares";
import {
  addSetToClass,
  createClass,
  deleteClass,
  getClass,
  getClasses,
  joinClass,
  leaveClass,
  removeSetFromClass,
  updateClass,
} from "./class.controller";
import {
  createClass as createClassSchema,
  joinClass as joinClassSchema,
  updateClass as updateClassSchema,
} from "./dtos";

const router = Router();

router.post(
  "/",
  authenticate(),
  validateRequestBody(createClassSchema),
  createClass,
);

router.get("/", authenticate(), getClasses);

router.get("/:id", authenticate(), getClass);

router.put(
  "/:id",
  authenticate(),
  validateRequestBody(updateClassSchema),
  updateClass,
);

router.delete("/:id", authenticate(), deleteClass);

router.post(
  "/:id/join",
  authenticate(),
  validateRequestBody(joinClassSchema),
  joinClass,
);

router.post("/:id/leave", authenticate(), leaveClass);

router.post("/:id/sets", authenticate(), addSetToClass);

router.delete("/:id/sets/:setId", authenticate(), removeSetFromClass);

export const classRouter = router;
