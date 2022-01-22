import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import axiosConfig from "../../../lib";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // let data = JSON.parse(req.body);
    let config = axiosConfig(req, "posts");
    // config.data = data;
    // config.headers!["content-type"] = "application/json";
    let resp = await axios(config);
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    return res.status(400).send({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
}
