import { GetServerSideProps, GetServerSidePropsContext } from "next";

const auth = (gssp: GetServerSideProps) => {
  return async (ctx: GetServerSidePropsContext) => {
    let cookies = ctx.req.cookies;
    let exists =
      cookies.idToken?.length > 0 && cookies.refreshToken?.length > 0;
    if (!exists) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
    return await gssp(ctx);
  };
};

export default auth;
