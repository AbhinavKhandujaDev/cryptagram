import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let savedToken = req.cookies.idToken;
  let newToken = req.query.token;
  return res.send({ success: savedToken === newToken });
}
