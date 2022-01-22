// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest } from "next";
import type { AxiosRequestConfig, Method } from "axios";

export default function axiosConfig(
  req: NextApiRequest,
  path: string | string[]
): AxiosRequestConfig<any> {
  let data = JSON.parse(req.body || "{}");
  let method: Method = (req.method || "GET") as Method;

  let config = {
    method: method,
    url: `${process.env.BASE_URL}/${path}`,
    headers: {
      authorization: req.cookies.idToken && `Bearer ${req.cookies.idToken}`,
    },
    data,
  };
  if (!data || Object.keys(data).length === 0) delete config["data"];
  console.debug("axiosConfig => ", config);
  return config;
}
