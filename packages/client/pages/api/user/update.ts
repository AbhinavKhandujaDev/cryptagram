import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig } from "axios";
import axiosConfig from "../../../lib";
import { returnErrorResp } from "../../../helper/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let resp = await axios(axiosConfig(req, "user"));
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    // return res.status(400).send({ success: false, message: error.message });
    return returnErrorResp(error, res);
  }
}
