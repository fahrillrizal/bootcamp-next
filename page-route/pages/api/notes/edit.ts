import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

const formSchema = z.object({
    id: z.string().min(1, 'ID is required'),
    title: z.string().min(1, 'Title wajib diisi!'),
    description: z.string().min(1, 'Description wajib diisi!'),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PATCH') {
        return res.status(405).json({ errorMessage: 'Method not allowed' })
    }

    try {
        const validatedData = formSchema.parse(req.body)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${validatedData.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validatedData)
        })
        
        const data = await response.json()
        
        if (data.success) {
            return res.status(200).json({ message: 'Note updated successfully' })
        } else {
            return res.status(400).json({ message: 'Failed to update note' })
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.formErrors.fieldErrors })
        }
        return res.status(500).json({ message: 'Internal server error' })
    }
}