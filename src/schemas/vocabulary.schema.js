const { z } = require('zod');

const createWordSchema = z.object({
  body: z.object({
    word: z.string({
      required_error: 'Word is required',
    }).trim().min(1, 'Word is required and must be a non-empty string'),
    translation: z.string({
      required_error: 'Translation is required',
    }).trim().min(1, 'Translation is required and must be a non-empty string'),
    status: z.enum(['learning', 'learned'], {
      errorMap: () => ({ message: 'Invalid status' })
    }).optional().default('learning'),
    example: z.string().trim().optional(),
  }),
});

const updateWordSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Word ID must be a non-empty string'),
  }),
  body: z.object({
    word: z.string().trim().min(1, 'Word must be a non-empty string').optional(),
    translation: z.string().trim().min(1, 'Translation must be a non-empty string').optional(),
    status: z.enum(['learning', 'learned'], {
      errorMap: () => ({ message: 'Invalid status' })
    }).optional(),
    example: z.string().trim().optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Update payload must be a non-empty object',
  }),
});

const getWordsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.enum(['learning', 'learned'], {
      errorMap: () => ({ message: 'Invalid status' })
    }).optional(),
  }),
});

const deleteWordSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Word ID must be a non-empty string'),
  }),
});

module.exports = {
  createWordSchema,
  updateWordSchema,
  getWordsSchema,
  deleteWordSchema,
};
