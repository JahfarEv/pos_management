import { Router } from "express";
import * as cartController from "../controllers/cart.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found or empty
 */
router.get("/", cartController.getCart);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *                 description: Product ObjectId
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *               price:
 *                 type: number
 *                 example: 999.99
 *                 description: Product price (can be fetched from product if not provided)
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post("/", cartController.addItem);

/**
 * @swagger
 * /api/cart/item/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from cart
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item not found in cart
 */
router.delete("/item/:productId", cartController.removeItem);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear all items from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart cleared successfully
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 */
router.delete("/", cartController.clear);

// (Optional) If you want to support updating items, you can also document a PUT /api/cart:
///**
// * @swagger
// * /api/cart:
// *   put:
// *     summary: Update items in cart (e.g. quantities)
// *     tags: [Cart]
// *     security:
// *       - bearerAuth: []
// *     requestBody:
// *       required: true
// *       content:
// *         application/json:
// *           schema:
// *             type: object
// *             properties:
// *               product:
// *                 type: string
// *               quantity:
// *                 type: integer
// *     responses:
// *       200:
// *         description: Cart updated successfully
// */
// router.put("/", cartController.updateItem);

export default router;
