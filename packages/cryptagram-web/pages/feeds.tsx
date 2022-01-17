import type { NextPage } from "next";
import { memo, useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { api } from "../helper";
import { Post } from "../components";

const CreateButton = memo(({ nightmode }: any) => (
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
        src={`/images/add${nightmode ? "" : "-selected"}.png`}
      />
    </div>
  </Link>
));

const Feeds: NextPage = (props: any) => {
  const { posts = [], nightmode } = props;
  const [state, setstate] = useState({
    posts: posts,
  });

  const liked = useCallback(async (post: any) => {
    let resp = await api(
      `api/post/likeunlike?id=${post._id}&unlike=${post.liked}`
    );
    if (resp.success) {
      setstate((prev) => {
        return {
          ...prev,
          posts: prev.posts.map((p: any) => {
            if (p._id === post._id) {
              var np = { ...p, liked: !p.liked };
            }
            return p._id === post._id ? np : p;
          }),
        };
      });
    }
  }, []);

  const savePost = useCallback(async (post: any) => {
    let resp = await api(
      `api/post/bookmarkPost?postId=${post._id}&unsave=${post.bookmarked}`
    );
    if (resp.success) {
      setstate((prev) => {
        return {
          ...prev,
          posts: prev.posts.map((p: any) => {
            if (p._id === post._id) {
              var np = { ...p, bookmarked: !p.bookmarked };
            }
            return p._id === post._id ? np : p;
          }),
        };
      });
    }
  }, []);

  const comment = useCallback(
    async (post: any, remove?: boolean, comment?: string) => {
      let resp = await api(
        `api/post/comment?postId=${post._id}&remove=${remove}`,
        { body: { comment: comment } }
      );
      if (resp.success) {
        setstate((prev) => {
          return {
            ...prev,
            posts: prev.posts.map((p: any) => {
              if (p._id === post._id) {
                var np = { ...p };
                np.comments.push(resp.data);
              }
              return p._id === post._id ? np : p;
            }),
          };
        });
      }
    },
    []
  );

  return (
    <div id="feeds" className="py-5 flex-center-h">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4 py-3 d-flex flex-column align-items-center ">
        {state.posts.map((post: any, i: number) => (
          <Post
            key={post._id}
            post={post}
            nightmode={nightmode}
            postliked={liked}
            postSaved={savePost}
            comment={comment}
          />
        ))}
        {/* <List
          items={getItems()}
          nightmode={nightmode}
          liked={liked}
          savePost={savePost}
          comment={comment}
        /> */}
      </div>
      <CreateButton nightmode={nightmode} />
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

export default memo(Feeds);
