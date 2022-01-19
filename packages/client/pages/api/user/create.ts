import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig } from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!req.cookies.idToken) {
      throw new Error("idToken not available");
      return;
    }
    let config: AxiosRequestConfig<any> = {
      method: "post",
      url: `${process.env.BASE_URL}/user/create`,
      headers: { Authorization: `Bearer ${req.cookies.idToken}` },
    };
    let resp = await axios(config);
    let resData = resp.data.data;
    return res.send({ success: true, data: resData });
  } catch (error: any) {
    return res.status(400).send({ success: false, message: error.message });
  }
}
