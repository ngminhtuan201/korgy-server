import { Request, Response } from "express";
import { errors } from "../../errors";
import {
  catchAsync,
  createPaginatedItems,
  documentId,
  getCurrentUser,
  getPageNumber,
  getPageSize,
  getSortField,
  getSortOrder,
  handleSuccess,
} from "../../libs";
import { Class, ClassModel } from "../../models";
import { generateClassCode } from "./class.helper";
import { CreateClassDto, JoinClassDto, UpdateClassDto } from "./dtos";

export const createClass = catchAsync(async (req: Request, res: Response) => {
  const dto = req.body as CreateClassDto;
  const user = getCurrentUser(req);

  const newClass: Class = {
    id: documentId(),
    userId: user.id,
    name: dto.name,
    description: dto.description,
    subject: dto.subject,
    code: generateClassCode(),
    isPublic: dto.isPublic ?? false,
    memberIds: [],
    setIds: [],
    thumbnailUrl: dto.thumbnailUrl,
  };

  await ClassModel.create(newClass);

  return handleSuccess(res, { newClass }, 201);
});

export const getClasses = catchAsync(async (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const pageSize = getPageSize(req);
  const pageNumber = getPageNumber(req);
  const sortField = getSortField(req);
  const sortOrder = getSortOrder(req) as "asc" | "desc";

  const skip = (pageNumber - 1) * pageSize;

  const filter = {
    $or: [{ userId: user.id }, { memberIds: user.id }],
  };

  const [classes, totalItems] = await Promise.all([
    ClassModel.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(pageSize)
      .lean()
      .exec(),
    ClassModel.countDocuments(filter).exec(),
  ]);

  const paginatedClasses = createPaginatedItems(
    classes,
    totalItems,
    pageSize,
    pageNumber,
  );

  return handleSuccess(res, { paginatedClasses });
});

export const getClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);

  const foundClass = (await ClassModel.findOne({
    id,
    $or: [{ userId: user.id }, { memberIds: user.id }, { isPublic: true }],
  })
    .lean()
    .exec()) as Class;

  if (!foundClass) {
    throw errors.ClassNotFound;
  }

  return handleSuccess(res, { class: foundClass });
});

export const updateClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);
  const dto = req.body as UpdateClassDto;

  const updatedClass = (await ClassModel.findOneAndUpdate(
    { id, userId: user.id },
    { $set: dto },
    { new: true },
  )
    .lean()
    .exec()) as Class;

  if (!updatedClass) {
    throw errors.ClassNotFound;
  }

  return handleSuccess(res, { updatedClass });
});

export const deleteClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);

  const deletedClass = (await ClassModel.findOneAndDelete({
    id,
    userId: user.id,
  })
    .lean()
    .exec()) as Class;

  if (!deletedClass) {
    throw errors.ClassNotFound;
  }

  return handleSuccess(res, null);
});

export const joinClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);
  const dto = req.body as JoinClassDto;

  const foundClass = (await ClassModel.findOne({
    id,
    code: dto.code,
  })
    .lean()
    .exec()) as Class;

  if (!foundClass) {
    throw errors.InvalidClassCode;
  }

  if (foundClass.userId === user.id || foundClass.memberIds.includes(user.id)) {
    throw errors.AlreadyJoinedClass;
  }

  const result = (await ClassModel.findOneAndUpdate(
    { id },
    { $addToSet: { memberIds: user.id } },
    { new: true },
  )
    .lean()
    .exec()) as Class;

  return handleSuccess(res, { class: result });
});

export const leaveClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = getCurrentUser(req);

  const foundClass = (await ClassModel.findOne({
    id,
    memberIds: user.id,
  })
    .lean()
    .exec()) as Class;

  if (!foundClass) {
    throw errors.ClassNotFound;
  }

  const result = (await ClassModel.findOneAndUpdate(
    { id },
    { $pull: { memberIds: user.id } },
    { new: true },
  )
    .lean()
    .exec()) as Class;

  return handleSuccess(res, { class: result });
});

export const addSetToClass = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { setId } = req.body as { setId: string };
  const user = getCurrentUser(req);

  const foundClass = (await ClassModel.findOne({
    id,
    userId: user.id,
  })
    .lean()
    .exec()) as Class;

  if (!foundClass) {
    throw errors.ClassNotFound;
  }

  const result = (await ClassModel.findOneAndUpdate(
    { id },
    { $addToSet: { setIds: setId } },
    { new: true },
  )
    .lean()
    .exec()) as Class;

  return handleSuccess(res, { class: result });
});

export const removeSetFromClass = catchAsync(
  async (req: Request, res: Response) => {
    const { id, setId } = req.params;
    const user = getCurrentUser(req);

    const foundClass = (await ClassModel.findOne({
      id,
      userId: user.id,
    })
      .lean()
      .exec()) as Class;

    if (!foundClass) {
      throw errors.ClassNotFound;
    }

    const result = (await ClassModel.findOneAndUpdate(
      { id },
      { $pull: { setIds: setId } },
      { new: true },
    )
      .lean()
      .exec()) as Class;

    return handleSuccess(res, { class: result });
  },
);
