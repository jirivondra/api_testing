import joi from 'joi'

export const todoSchema = joi.object({
  id: joi.number().integer().positive().required(),
  title: joi.string().required(),
  description: joi.string().allow(null, '').optional(),
  completed: joi.boolean().required(),
})

export const todoListSchema = joi.array().items(todoSchema)
