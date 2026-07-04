const { z } = require('zod');

const createCategorySchema = z.object({
  body: z.object({
    display_name: z.string({
      required_error: 'Display name is required',
    }).trim().min(1, 'Display name cannot be empty'),
    slug: z.string({
      required_error: 'Slug is required',
    }).trim().min(1, 'Slug cannot be empty'),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Category ID must be a valid UUID'),
  }),
  body: z.object({
    display_name: z.string().trim().min(1, 'Display name cannot be empty').optional(),
    slug: z.string().trim().min(1, 'Slug cannot be empty').optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Update payload must be a non-empty object',
  }),
});

const getCategoriesSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Category ID must be a valid UUID'),
  }),
});

const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid('Category ID must be a valid UUID'),
  }),
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  getCategoriesSchema,
  getCategoryByIdSchema,
  deleteCategorySchema,
};
