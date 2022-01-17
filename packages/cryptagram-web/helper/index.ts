export const api = async (url: string, data?: any) => {
  data = { method: "post", ...data };
  data.body = data.body ? JSON.stringify(data.body) : data.body;
  let resp = await fetch(url, data);
  if (resp.ok) {
    return resp.json();
  } else {
    console.log("client<->server error ==> ", resp);
    return Promise.reject({
      message: "Something went wrong client<->server!",
      success: false,
    });
  }
};
