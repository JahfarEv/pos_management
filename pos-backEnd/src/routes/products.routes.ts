import { Router } from "express";
import * as productController from "../controllers/product.controller";
import validate from "../middleware/validate";
import { createProductSchema, updateProductSchema } from "../validators/productValidators";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

router.post("/", validate(createProductSchema), productController.create);
router.get("/", productController.list);
router.get("/:id", productController.getById);
router.put("/:id", validate(updateProductSchema), productController.update);
router.delete("/:id", productController.remove);


export default router;
