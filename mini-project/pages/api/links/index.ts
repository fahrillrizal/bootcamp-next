// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { linksTable } from '@/lib/db/schema'

type Response = {
  id: number
  title: string
  url: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: Response[] }>,
) {
  const data = await db.select().from(linksTable)

  res.status(200).json({ data })
}
