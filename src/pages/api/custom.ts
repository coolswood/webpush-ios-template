import MagicBell from "magicbell"
import type { NextApiRequest, NextApiResponse } from "next"

interface HugsRequest extends NextApiRequest {
  body: {
    userId: string
    title: string
  }
}

type ResponseData = {
  status: string
}

const magicbell = new MagicBell({
  apiKey: process.env.NEXT_PUBLIC_MAGICBELL_API_KEY,
  apiSecret: process.env.MAGICBELL_API_SECRET,
})

export default async function handler(
  req: HugsRequest,
  res: NextApiResponse<ResponseData>
) {
  await magicbell.notifications.create({
    title: req.body.title,
    recipients: [{ external_id: "7503561573283518" }],
    category: "default",
  })
  res.status(200).json({ status: "success" })
}
