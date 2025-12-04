// ============================================
// FILE: src/swagger.ts
// ============================================

import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'POS API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for E-commerce application with user authentication, products, categories, and cart management',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.yourdomain.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            mobile: {
              type: 'string',
              pattern: '^[6-9]\\d{9}$',
              example: '9876543210',
              description: 'Indian mobile number starting with 6-9',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Product: {
          type: 'object',
          required: ['name', 'purchaseRate', 'retailRate'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'Samsung Galaxy S21',
            },
            hsn: {
              type: 'string',
              example: '8517',
              description: 'HSN Code',
            },
            code: {
              type: 'string',
              example: 'PROD-001',
            },
            barcode: {
              type: 'string',
              example: '1234567890123',
            },
            purchaseRate: {
              type: 'number',
              example: 800,
              description: 'Purchase price',
            },
            retailRate: {
              type: 'number',
              example: 999.99,
              description: 'Retail price',
            },
            wholesaleRate: {
              type: 'number',
              example: 900,
            },
            unitPrimary: {
              type: 'string',
              example: 'Piece',
            },
            unitSecondary: {
              type: 'string',
              example: 'Box',
            },
            conversionFactor: {
              type: 'number',
              example: 1,
              default: 1,
            },
            discountAmount: {
              type: 'number',
              example: 50,
              default: 0,
            },
            discountType: {
              type: 'string',
              enum: ['Percentage', 'Fixed'],
              example: 'Percentage',
              default: 'Percentage',
            },
            warehouse: {
              type: 'string',
              example: 'Warehouse A',
            },
            taxPercentage: {
              type: 'number',
              example: 18,
              default: 0,
            },
            batchEnabled: {
              type: 'boolean',
              default: false,
            },
            serialNumberEnabled: {
              type: 'boolean',
              default: false,
            },
            openingStockEnabled: {
              type: 'boolean',
              default: false,
            },
            purchaseTax: {
              type: 'string',
              enum: ['include', 'exclude'],
              default: 'exclude',
            },
            retailTax: {
              type: 'string',
              enum: ['include', 'exclude'],
              default: 'exclude',
            },
            wholesaleTax: {
              type: 'string',
              enum: ['include', 'exclude'],
              default: 'exclude',
            },
            category: {
              type: 'string',
              example: 'Electronics',
            },
            lowStock: {
              type: 'boolean',
              default: false,
            },
            stock: {
              type: 'number',
              example: 50,
              default: 0,
            },
            isActive: {
              type: 'boolean',
              default: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Category: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            name: {
              type: 'string',
              example: 'Electronics',
            },
            slug: {
              type: 'string',
              example: 'electronics',
              description: 'Auto-generated from name',
            },
            description: {
              type: 'string',
              example: 'Electronic devices and accessories',
            },
            isActive: {
              type: 'boolean',
              default: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        CartItem: {
          type: 'object',
          required: ['product', 'price', 'quantity', 'subtotal'],
          properties: {
            product: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
              description: 'Product ObjectId',
            },
            name: {
              type: 'string',
              example: 'Samsung Galaxy S21',
            },
            price: {
              type: 'number',
              example: 999.99,
            },
            quantity: {
              type: 'integer',
              minimum: 1,
              example: 2,
            },
            subtotal: {
              type: 'number',
              example: 1999.98,
            },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
            },
            user: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
              description: 'User ObjectId',
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CartItem',
              },
            },
            total: {
              type: 'number',
              example: 2999.97,
              default: 0,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Categories',
        description: 'Category management endpoints',
      },
      {
        name: 'Cart',
        description: 'Shopping cart endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'E-commerce API Docs',
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log('📚 Swagger documentation available at /api-docs');
};


// ============================================
// FILE: src/routes/authRoutes.ts
// ============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobile
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               mobile:
 *                 type: string
 *                 pattern: '^[6-9]\d{9}$'
 *                 example: "9876543210"
 *                 description: Indian mobile number (10 digits starting with 6-9)
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *                 minLength: 6
 *               username:
 *                 type: string
 *                 example: johndoe
 *                 description: Optional username
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid input or mobile number already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - password
 *             properties:
 *               mobile:
 *                 type: string
 *                 pattern: '^[6-9]\d{9}$'
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */


// ============================================
// FILE: src/routes/productRoutes.ts
// ============================================

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


// ============================================
// FILE: src/routes/categoryRoutes.ts
// ============================================

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *                 description: Category name (slug will be auto-generated)
 *               description:
 *                 type: string
 *                 example: Electronic devices and accessories
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid input or category already exists
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

/**
 * @swagger
 * /api/categories/{slug}/products:
 *   get:
 *     summary: Get products by category slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug (auto-generated from name)
 *         example: electronics
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Products in category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 category:
 *                   $ref: '#/components/schemas/Category'
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 total:
 *                   type: integer
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New category name (slug will be updated automatically)
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized
 */


// ============================================
// FILE: src/routes/cartRoutes.ts
// ============================================

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



// ============================================
// AUTHENTICATION ROUTES - Copy above your auth endpoints
// ============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobile
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: Password123!
 *               username:
 *                 type: string
 *                 example: johndoe
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Mobile already exists
 */
// router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobile
 *               - password
 *             properties:
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */
// router.post('/login', login);


// ============================================
// PRODUCT ROUTES - Copy above your product endpoints
// ============================================

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
 *               purchaseRate:
 *                 type: number
 *                 example: 800
 *               retailRate:
 *                 type: number
 *                 example: 999.99
 *               wholesaleRate:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Product created successfully
 */
// router.post('/', authenticate, createProduct);

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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 */
// router.get('/', getProducts);

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
 *       404:
 *         description: Product not found
 */
// router.get('/:id', getProductById);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               purchaseRate:
 *                 type: number
 *               retailRate:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
// router.put('/:id', authenticate, updateProduct);

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
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
// router.delete('/:id', authenticate, deleteProduct);


// ============================================
// CATEGORY ROUTES - Copy above your category endpoints
// ============================================

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Category created successfully
 */
// router.post('/', authenticate, createCategory);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of categories
 */
// router.get('/', getCategories);

/**
 * @swagger
 * /api/categories/{slug}/products:
 *   get:
 *     summary: Get products by category slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: electronics
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products in category
 *       404:
 *         description: Category not found
 */
// router.get('/:slug/products', getProductsByCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
// router.put('/:id', authenticate, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
// router.delete('/:id', authenticate, deleteCategory);


// ============================================
// CART ROUTES - Copy above your cart endpoints
// ============================================

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
 *                 example: "507f1f77bcf86cd799439011"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               price:
 *                 type: number
 *                 example: 999.99
 *     responses:
 *       200:
 *         description: Item added to cart
 *       404:
 *         description: Product not found
 */
// router.post('/', authenticate, addToCart);

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
 *         description: Cart details
 *       404:
 *         description: Cart not found
 */
// router.get('/', authenticate, getCart);

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
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found
 */
// router.delete('/item/:productId', authenticate, removeFromCart);

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
 */
// router.delete('/', authenticate, clearCart);


// ============================================
// HOW TO USE:
// ============================================
/*

1. Copy the Swagger comment blocks above your existing route handlers
2. Remove the commented router lines (they're just examples)
3. Keep your existing router.post(), router.get(), etc. lines

Example in your authRoutes.ts:

import express from 'express';
const router = express.Router();

// Copy the @swagger comment here
router.post('/register', yourRegisterHandler);

// Copy the @swagger comment here
router.post('/login', yourLoginHandler);

export default router;

*/