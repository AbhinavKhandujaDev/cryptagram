import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig } from "axios";
import axiosConfig from "../../../lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let path = `posts/like/${req.query.id}`;
    let resp = await axios(axiosConfig(req, path));
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    return res.status(400).send({ success: false, message: error.message });
  }
}
