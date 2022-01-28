import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
import { useEffect, useState } from "react";
import { signOut, getAuth } from "firebase/auth";
import api, { deleteTokens } from "../../helper/api";
import Router from "next/router";
import auth from "../../helper/auth";
import { LoaderView } from "../../components";

const Profile: NextPage = (props: any) => {
  const { isCurrentUser, username } = props;
  const [state, setstate] = useState<any>({
    posts: [],
    user: null,
    isloading: true,
  });

  const fetchPosts = async () => {
    let res = await api.get(
      `../api/post/getAllPosts?username=${state.user?.username}`
    );
    return res.data;
  };
  useEffect(() => {
    if (!username) return;
    (async () => {
      let userData = await api.get(`../api/user/getUser?username=${username}`);
      let resp = await fetchPosts();
      setstate((prev: any) => ({
        ...prev,
        posts: resp,
        loadingPosts: false,
        user: userData.data,
        isloading: false,
      }));
    })();
  }, [username]);
  return (
    <LoaderView
      loading={state.isloading}
      id="profile"
      cls="page flex-center-c justify-content-start py-5 overflow-hidden"
    >
      <div className="col-12 col-md-8 col-lg-6">
        <div className="flex-center-c my-5">
          <div className="col-5 col-lg-3 bg-theme-opp ratio-eq flex-center-h rounded-circle overflow-hidden p-1 loading-view">
            <img
              width="100%"
              className="w-100 ratio-eq rounded-circle"
              src="https://i.pravatar.cc"
            />
          </div>
          <label className="fs-1 fw-bold my-3 loading-view rounded">
            {state.user?.username}
          </label>
          <div className="flex-center-h flex-wrap col-12 px-4">
            {isCurrentUser ? null : (
              <>
                <label className="flex-shrink-0 btn btn-sm bg-prime fw-bold text-white">
                  Unfollow
                </label>
                <label className="flex-shrink-0 btn mx-2 border btn-sm fw-bold">
                  Message
                </label>
                <label className="flex-shrink-0 btn border btn-sm fw-bold">
                  Support
                </label>
              </>
            )}
            <label className="flex-shrink-0 btn mx-2 border btn-sm fw-bold">
              Edit
            </label>
            <label
              className="flex-shrink-0 btn border btn-sm fw-bold"
              onClick={async () => {
                signOut(getAuth()).then(async () => {
                  await deleteTokens("..");
                  Router.push("/");
                });
              }}
            >
              Logout
            </label>
          </div>
        </div>
        <div
          style={{ gap: "1rem" }}
          className="flex-grow-1 row mb-3 flex-center-h"
        >
          {state.posts.map((post: any, i: number) => (
            <div
              key={post._id}
              className="col-3 m-0 p-1 bg-theme-tinted overflow-hidden rounded-3"
            >
              <img
                style={{ objectFit: "cover" }}
                width="100%"
                className="w-100"
                // src="https://i.pravatar.cc"
                src={post.postUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </LoaderView>
  );
};

export const getServerSideProps: GetServerSideProps = auth(
  async (ctx: GetServerSidePropsContext) => {
    let resp = await api.get(
      `${process.env.CLIENT_BASE_URL}/cookies/matchIdToken`
    );
    let user = JSON.parse(ctx.req.cookies.user);
    let puser = ctx.params?.username;
    return {
      props: {
        isCurrentUser: user.username === puser,
        username: puser,
      },
    };
  }
);

export default Profile;
