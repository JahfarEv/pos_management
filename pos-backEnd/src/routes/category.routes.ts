import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import validate from "../middleware/validate";
import { createCategorySchema, updateCategorySchema } from "../validators/categoryValidators";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

router.post("/", validate(createCategorySchema), categoryController.create);
router.get("/",authenticate, categoryController.list);
router.get("/:slug", categoryController.getProductsByCategorySlug); // get by slug
router.get("/:id", categoryController.getById);
router.put("/:id", validate(updateCategorySchema), categoryController.update);
router.delete("/:id", categoryController.remove);

export default router;
