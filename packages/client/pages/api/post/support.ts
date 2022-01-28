import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import axiosConfig from "../../../lib";
import { returnErrorResp } from "../../../helper/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let resp = await axios(axiosConfig(req, "posts/support"));
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    return returnErrorResp(error, res);
  }
}
