import type { NextApiRequest, NextApiResponse } from "next";
const cookie = require("cookie");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let body = JSON.parse(req.body);
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(body.key, body.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV != "development",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "strict",
      path: "/",
    })
  );
  res.send({ success: true, message: "save successfully" });
}
