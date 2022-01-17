import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { api } from "../helper";

const Profile: NextPage = (props: any) => {
  const { posts = [] } = props;
  return (
    <div className="page flex-center-c justify-content-start py-5 overflow-hidden">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="flex-center-c my-5">
          <div className="col-5 col-lg-3 bg-theme-opp ratio-eq flex-center-h rounded-circle overflow-hidden p-1">
            <img
              width="100%"
              className="w-100 ratio-eq rounded-circle"
              src="https://i.pravatar.cc"
            />
          </div>
          <label className="fs-1 fw-bold my-3">Abhinav Khanduja</label>
          <div className="flex-center-h flex-wrap col-12 col-md-10 col-lg-8 justify-content-between px-4">
            <label className="flex-shrink-0 btn btn-sm bg-prime fw-bold text-white">
              Unfollow
            </label>
            <label className="flex-shrink-0 btn border btn-sm fw-bold">
              Message
            </label>
            <label className="flex-shrink-0 btn border btn-sm fw-bold">
              Support
            </label>
            <label className="flex-shrink-0 btn border btn-sm fw-bold">
              Edit
            </label>
          </div>
        </div>
        <div
          style={{ gap: "1rem" }}
          className="flex-grow-1 row mb-3 flex-center-h"
        >
          {posts.map((post: any, i: number) => (
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
    </div>
  );
};

export async function getServerSideProps() {
  let res;
  try {
    res = await api(
      `${process.env.BASE_URL}/api/posts/61d831b1337327f553562968`,
      { method: "GET" }
    );
  } catch (error) {
    console.log("get Profile Posts error ", error);
    res = { data: [] };
  }
  return {
    props: {
      posts: res.data,
    },
  };
}

export default Profile;
