import type { NextPage, GetServerSidePropsContext } from "next";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "../helper";

interface PostProps {
  post: any;
}

const Post = memo(({ post }: PostProps) => {
  return (
    <div className="w-100 overflow-hidden">
      <div className="post card bg-theme my-3">
        <div className="card-header flex-center-h justify-content-between bg-theme">
          <div className="flex-center-h">
            <Image
              className="rounded-circle"
              width={40}
              height={40}
              src="https://i.pravatar.cc/40"
            />
            <div className="d-flex flex-column justify-content-start ms-2">
              <label className="fw-bold">{post.fromName}</label>
              <label className="text-muted">2 days ago</label>
            </div>
          </div>
          <div className="d-flex btn">
            <div
              style={{ width: 6 }}
              className="ratio-eq rounded-circle bg-theme-opp"
            />
            <div
              style={{ width: 6 }}
              className="ratio-eq rounded-circle bg-theme-opp mx-1"
            />
            <div
              style={{ width: 6 }}
              className="ratio-eq rounded-circle bg-theme-opp"
            />
          </div>
        </div>
        <div className="card-body flex-center-v bg-theme">
          <img
            className="flex-grow-1 w-100 ratio-eq rounded-3"
            // src="https://source.unsplash.com/random/user"
            // src={`${process.env.MEDIA_BASE_URL}/${post.postUrl}`}
            src={`https://ipfs.infura.io/ipfs/${post.postUrl}`}
          />
          <label className="fw-bold fs-6 mt-2">{post.caption}</label>
        </div>
        <div className="card-footer"></div>
      </div>
    </div>
  );
});

const Feeds: NextPage = (props: any) => {
  const { posts = [] } = props;
  return (
    <div id="feeds" className="py-5 flex-center-h">
      <div className="col-12 col-sm-10 col-md-6 col-lg-4 py-3 d-flex flex-column align-items-center ">
        {posts.map((post: any) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
      <Link href="/create">
        <div
          style={{
            top: "100%",
            transform: "translateY(-200%)",
            width: "45px",
            right: "20px",
          }}
          className="flex-center-h ratio-eq position-fixed pointer d-none d-md-flex p-2"
        >
          <img
            className="w-100 h-100 shadow"
            src={`/images/add${props.nightmode ? "" : "-selected"}.png`}
          />
        </div>
      </Link>
    </div>
  );
};

export async function getServerSideProps() {
  let res;
  try {
    res = await api(`${process.env.CLIENT_BASE_URL}/api/post/getAllPosts`, {
      method: "GET",
    });
  } catch (error) {
    console.log("getAllPosts error ", error);
    res = { data: [] };
  }
  return {
    props: {
      posts: res.data,
    },
  };
}

export default Feeds;
