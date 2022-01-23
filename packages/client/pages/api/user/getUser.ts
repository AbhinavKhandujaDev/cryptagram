import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import axiosConfig from "../../../lib";
import { returnErrorResp } from "../../../helper/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.cookies.idToken) {
      throw new Error("idToken not available");
    }
    let path = `user/${req.query.username}`;
    let resp = await axios(axiosConfig(req, path));
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    return returnErrorResp(error, res);
  }
}
