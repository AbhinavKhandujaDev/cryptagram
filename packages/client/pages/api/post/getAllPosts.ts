import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let id = req.query.id ? req.query.id : "";
    let resp = await axios.get(`${process.env.BASE_URL}/posts/${id}`);
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    return res.status(400).send({ success: false, message: error.message });
  }
}
