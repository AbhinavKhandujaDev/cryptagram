import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let config: AxiosRequestConfig<any> = {
      method: req.query.unsave === "true" ? "delete" : "post",
      url: `${process.env.BASE_URL}/api/posts/bookmark/${req.query.postId}`,
    };
    let resp = await axios(config);
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    return res.status(400).send({ success: false, message: error.message });
  }
}
