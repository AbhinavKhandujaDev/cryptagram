import { GetServerSideProps, GetServerSidePropsContext } from "next";

const auth = (gssp: GetServerSideProps) => {
  return async (ctx: GetServerSidePropsContext) => {
    let cookies = ctx.req.cookies;
    let exists =
      cookies.idToken?.length > 0 && cookies.refreshToken?.length > 0;
    console.log("CONTEXT URL IS => ", ctx.resolvedUrl);

    if (!exists && ctx.resolvedUrl !== "/") {
      console.log("a");
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    } else if (exists && ctx.resolvedUrl === "/") {
      console.log("a");
      return {
        redirect: {
          permanent: false,
          destination: "/feeds",
        },
      };
    }
    console.log("c");
    return await gssp(ctx);
  };
};

export default auth;
