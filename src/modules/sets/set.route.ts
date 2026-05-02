import { Router } from "express";
import { authenticate, validateRequestBody } from "../../middlewares";
import { createSetSchema, generateSetSchema, updateSetSchema } from "./dtos";
import {
  createSet,
  deleteSet,
  generateSet,
  getSet,
  getSets,
  updateSet,
} from "./set.controller";

export const setRouter = Router();

// Get all sets for the current user
setRouter.get("/", authenticate(), getSets);

// Get a single set by ID
setRouter.get("/:id", authenticate(), getSet);

setRouter.post(
  "/",
  authenticate(),
  validateRequestBody(createSetSchema),
  createSet,
);

setRouter.post(
  "/generate",
  authenticate(),
  validateRequestBody(generateSetSchema),
  generateSet,
);

setRouter.put(
  "/:id",
  authenticate(),
  validateRequestBody(updateSetSchema),
  updateSet,
);

setRouter.delete("/:id", authenticate(), deleteSet);
