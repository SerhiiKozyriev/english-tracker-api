const { z } = require('zod');

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const topicSchema = z.object({
  category: z.object({
    id: z.string({
      required_error: 'Topic category ID is required',
    }).trim().min(1, 'Topic category ID cannot be empty'),
    slug: z.string().optional(),
    display_name: z.string().optional(),
  }),
  desc: z.array(
    z.string({
      required_error: 'Topic description is required',
    }).trim().min(1, 'Topic description cannot be empty')
  ).nonempty('Topic description must have at least one item'),
});

const createSessionSchema = z.object({
  body: z.object({
    date: z.string({
      required_error: 'Date is required',
    }).trim().regex(dateRegex, 'Date must be in YYYY-MM-DD format'),
    duration: z.number({
      required_error: 'Duration is required',
    }).positive('Duration must be a positive number'),
    notes: z.string().trim().optional().default(''),
    topics: z.array(topicSchema).nonempty('Session must have at least one topic'),
  }),
});

const updateSessionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Session ID must be a non-empty string'),
  }),
  body: z.object({
    date: z.string().trim().regex(dateRegex, 'Date must be in YYYY-MM-DD format').optional(),
    duration: z.number().positive('Duration must be a positive number').optional(),
    notes: z.string().trim().optional(),
    topics: z.array(topicSchema).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'Update payload must be a non-empty object',
  }),
});

const getSessionsSchema = z.object({
  query: z.object({
    search: z.string().optional(),
  }),
});

const deleteSessionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Session ID must be a non-empty string'),
  }),
});

module.exports = {
  createSessionSchema,
  updateSessionSchema,
  getSessionsSchema,
  deleteSessionSchema,
};
