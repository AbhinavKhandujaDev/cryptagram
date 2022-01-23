import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import axiosConfig from "../../../lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.cookies);
    let username = req.query.username ? req.query.username : "";
    let resp = await axios(axiosConfig(req, `posts/${username}`));
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const axError = error as AxiosError;
      let code = axError.response?.status || 400;
      return res.status(code).send(axError.response?.data);
    }
    return res.status(400).send({ success: false, message: error.message });
  }
}
