import { Router } from "express";
import * as productController from "../controllers/product.controller";
import validate from "../middleware/validate";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidators";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - purchaseRate
 *               - retailRate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Samsung Galaxy S21
 *               hsn:
 *                 type: string
 *                 example: "8517"
 *               code:
 *                 type: string
 *                 example: PROD-001
 *               barcode:
 *                 type: string
 *                 example: "1234567890123"
 *               purchaseRate:
 *                 type: number
 *                 example: 800
 *               retailRate:
 *                 type: number
 *                 example: 999.99
 *               wholesaleRate:
 *                 type: number
 *                 example: 900
 *               unitPrimary:
 *                 type: string
 *                 example: Piece
 *               unitSecondary:
 *                 type: string
 *                 example: Box
 *               conversionFactor:
 *                 type: number
 *                 example: 1
 *               discountAmount:
 *                 type: number
 *                 example: 50
 *               discountType:
 *                 type: string
 *                 enum: [Percentage, Fixed]
 *                 example: Percentage
 *               warehouse:
 *                 type: string
 *                 example: Warehouse A
 *               taxPercentage:
 *                 type: number
 *                 example: 18
 *               batchEnabled:
 *                 type: boolean
 *                 example: false
 *               serialNumberEnabled:
 *                 type: boolean
 *                 example: false
 *               openingStockEnabled:
 *                 type: boolean
 *                 example: false
 *               purchaseTax:
 *                 type: string
 *                 enum: [include, exclude]
 *                 example: exclude
 *               retailTax:
 *                 type: string
 *                 enum: [include, exclude]
 *                 example: exclude
 *               wholesaleTax:
 *                 type: string
 *                 enum: [include, exclude]
 *                 example: exclude
 *               category:
 *                 type: string
 *                 example: Electronics
 *               stock:
 *                 type: number
 *                 example: 50
 *               lowStock:
 *                 type: boolean
 *                 example: false
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  productController.create
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 pages:
 *                   type: integer
 *                   example: 10
 */
router.get("/", productController.list);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", productController.getById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               hsn:
 *                 type: string
 *               code:
 *                 type: string
 *               barcode:
 *                 type: string
 *               purchaseRate:
 *                 type: number
 *               retailRate:
 *                 type: number
 *               wholesaleRate:
 *                 type: number
 *               unitPrimary:
 *                 type: string
 *               unitSecondary:
 *                 type: string
 *               conversionFactor:
 *                 type: number
 *               discountAmount:
 *                 type: number
 *               discountType:
 *                 type: string
 *                 enum: [Percentage, Fixed]
 *               warehouse:
 *                 type: string
 *               taxPercentage:
 *                 type: number
 *               batchEnabled:
 *                 type: boolean
 *               serialNumberEnabled:
 *                 type: boolean
 *               openingStockEnabled:
 *                 type: boolean
 *               purchaseTax:
 *                 type: string
 *                 enum: [include, exclude]
 *               retailTax:
 *                 type: string
 *                 enum: [include, exclude]
 *               wholesaleTax:
 *                 type: string
 *                 enum: [include, exclude]
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               lowStock:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/:id",
  authenticate,
  validate(updateProductSchema),
  productController.update
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", authenticate, productController.remove);

export default router;
