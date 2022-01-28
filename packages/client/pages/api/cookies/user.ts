import type { NextApiRequest, NextApiResponse } from "next";
import { returnErrorResp } from "../../../helper/api";

const cookie = require("cookie");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (
    req.cookies.idToken?.length <= 0 ||
    req.cookies.refreshToken?.length <= 0
  ) {
    return res.send({ success: false, message: "token invalid" });
  }
  try {
    let user = JSON.parse(req.cookies.user);
    return res.send({ success: true, data: JSON.parse(req.cookies.user) });
  } catch (error) {
    return returnErrorResp(error, res);
  }
}
