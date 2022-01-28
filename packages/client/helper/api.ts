import Error from "next/error";
import type { User } from "firebase/auth";
import type { NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { getAuth } from "firebase/auth";

export const call = async (
  url: string,
  method: string,
  data?: any
): Promise<any> => {
  data = { method: method, ...data };
  data.body = JSON.stringify(data.body);
  !data.body && delete data["body"];
  // console.log(data);
  try {
    let resp = await fetch(url, data);
    let json = await resp.json();

    if (!resp.ok || !json.success) {
      console.log("resp => ", resp);
      throw new Error({
        statusCode: resp.status,
        title: json.message,
      });
      // throw new Error(json.message);
    }
    return json;
  } catch (error: any) {
    console.log("Api Error => ", error);
    if (error.props?.title === "Id token expired") {
      let auth = getAuth();
      auth.currentUser && saveTokenCookie(auth.currentUser);
      return call(url, method, data);
    }
    return Promise.reject({
      message: error.props?.title || "Something went wrong",
      success: false,
    });
  }
};

export const returnErrorResp = (error: any, res: NextApiResponse) => {
  // console.log("returnErrorResp error => ", error);

  if (axios.isAxiosError(error)) {
    const axError = error as AxiosError;
    let code = axError.response?.status || 400;
    return res.status(code).send(axError.response?.data);
  }
  return res.status(400).send({ success: false, message: error.message });
};

const api = {
  get: async (url: string, data?: any): Promise<any> => {
    return call(url, "get", data);
  },
  put: async (url: string, data?: any): Promise<any> => {
    return call(url, "put", data);
  },
  post: async (url: string, data?: any): Promise<any> => {
    return call(url, "post", data);
  },
  delete: async (url: string, data?: any): Promise<any> => {
    return call(url, "delete", data);
  },
};

export const saveTokenCookie = async (user: User, urlpre: string = "") => {
  let idToken = await user.getIdToken();
  let refToken = user.refreshToken;
  let url = `${urlpre}/api/cookies/saveCookie`;
  let objs = [
    { key: "idToken", value: idToken },
    { key: "refreshToken", value: refToken },
  ];
  await Promise.all(objs.map(async (o) => await api.post(url, { body: o })));
};

export const deleteTokens = async (urlpre: string) => {
  let keys = ["idToken", "refreshToken", "user"];
  let url = `${urlpre}/api/cookies/saveCookie`;
  keys.forEach(async (key) => {
    await api.post(url, {
      body: { key: key, value: "" },
    });
  });
};

export default api;
