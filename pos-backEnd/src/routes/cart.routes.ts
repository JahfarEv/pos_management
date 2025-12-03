import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth";


const router = Router();

router.use(authenticate);


router.get("/", cartController.getCart);

router.post("/items", cartController.addItem);

router.put("/items", cartController.updateItem);

router.delete("/items/:productId", cartController.removeItem);

router.delete("/", cartController.clear);


export default router;
