import { Request, Response } from "express";
import { errors } from "../../errors";
import {
  catchAsync,
  documentId,
  getCurrentUser,
  handleSuccess,
} from "../../libs";
import { Set, SetModel } from "../../models";
import { CreateSetDto, GenerateSetDto } from "./dtos";

// Get all sets for the current user
export const getSets = catchAsync(async (req: Request, res: Response) => {
  const userId = getCurrentUser(req).id;

  const sets = (await SetModel.find({ userId })
    .sort({ updatedAt: -1 })
    .lean()
    .exec()) as Set[];

  return handleSuccess(res, { sets });
});

// Get a single set by ID
export const getSet = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = getCurrentUser(req).id;

  const set = (await SetModel.findOne({ id, userId }).lean().exec()) as Set;

  if (!set) {
    throw errors.SetNotFound;
  }

  return handleSuccess(res, { set });
});

export const createSet = catchAsync(async (req: Request, res: Response) => {
  const dto = req.body as CreateSetDto;
  const newSet: Set = {
    id: documentId(),
    userId: getCurrentUser(req).id,
    name: dto.name,
    description: dto.description,
    isPublic: dto.isPublic,
    thumbnailUrl: dto.thumbnailUrl,
    isFavorite: false,
    questions: [],
  };

  await SetModel.create(newSet);

  return handleSuccess(res, { newSet });
});

export const generateSet = catchAsync(async (req: Request, res: Response) => {
  const dto = req.body as GenerateSetDto;
});

export const updateSet = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedSet = (await SetModel.findOneAndUpdate(
    { id, userId: getCurrentUser(req).id },
    { $set: req.body },
    { new: true },
  )
    .lean()
    .exec()) as Set;

  if (!updatedSet) {
    throw errors.SetNotFound;
  }

  return handleSuccess(res, { updatedSet });
});

export const deleteSet = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const set = (await SetModel.findOneAndDelete({
    id,
    userId: getCurrentUser(req).id,
  })
    .lean()
    .exec()) as Set;

  if (!set) {
    throw errors.SetNotFound;
  }

  return handleSuccess(res, null);
});
