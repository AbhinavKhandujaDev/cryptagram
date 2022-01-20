import type { NextApiRequest, NextApiResponse } from "next";

const cookie = require("cookie");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  let keys = Object.keys(req.cookies);
  keys.forEach((key) => {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize(key, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV != "development",
        maxAge: 10,
        sameSite: "strict",
        path: "/",
      })
    );
  });
  return res.send({ success: true, message: "save successfully" });
}
