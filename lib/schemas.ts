import { z } from "zod";

export const ProductSchema = z.object({
    title: z.string(),
    description: z.string(),
    short_description: z.string(),
    price: z.number(),
    salePrice: z.number(),
    type: z.string(),
    category: z.string(),
    images: z.array(z.string()),
    preview: z.string().optional(),
    sampleUrl: z.string().optional(),
    requirements: z.array(z.string()),
    features: z.array(z.string()),
    status: z.enum(["draft", "published"]),
    rating: z.number().optional().default(0),
    review: z.number().default(0).optional(),
    featured: z.boolean().default(false).optional(),
    instructor: z.string().optional(),
});

export const CategorySchema = z.object({
    name: z.string(),
    slug: z.string(),
    icon: z.string(),
    description: z.string(),
    color: z.string(),
});

export const BankAccountSchema = z.object({
    name: z.string(),
    accountName: z.string(),
    accountNumber: z.string(),
    iban: z.string(),
    phoneNumber: z.string(),
    instructions: z.string().optional()
})