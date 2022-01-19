import type { NextPage } from "next";
import { memo, useState, useCallback } from "react";
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

  const updatePost = useCallback((post: any, key: string, value: any) => {
    setstate((prev) => {
      return {
        ...prev,
        posts: prev.posts.map((p: any) => {
          return p._id === post._id ? { ...p, [key]: value } : p;
        }),
      };
    });
  }, []);

  const liked = useCallback(async (post: any) => {
    let resp = await api(
      `api/post/likeunlike?id=${post._id}&unlike=${post.liked}`
    );
    if (resp.success) {
      updatePost(post, "liked", !post.liked);
    }
  }, []);

  const savePost = useCallback(async (post: any) => {
    let resp = await api(
      `api/post/bookmarkPost?postId=${post._id}&unsave=${post.bookmarked}`
    );
    if (resp.success) {
      updatePost(post, "bookmarked", !post.bookmarked);
    }
  }, []);

  const comment = useCallback(
    async (post: any, remove?: boolean, comment?: string) => {
      let resp = await api(
        `api/post/comment?postId=${post._id}&remove=${remove}`,
        { body: { comment: comment } }
      );
      if (resp.success) {
        post.comments.push(resp.data);
        updatePost(post, "comments", post.comments);
      }
    },
    []
  );

  return (
    <div id="feeds" className="py-5 flex-center-h">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4 py-3 d-flex flex-column align-items-center ">
        {state.posts.map((post: any) => (
          <Post
            key={post._id}
            post={post}
            nightmode={nightmode}
            postliked={liked}
            postSaved={savePost}
            comment={comment}
          />
        ))}
      </div>
      <CreateButton nightmode={nightmode} />
    </div>
  );
};

export async function getServerSideProps() {
  let res;
  try {
    res = await api(`${process.env.CLIENT_BASE_URL}/post/getAllPosts`, {
      method: "GET",
    });
  } catch (error: any) {
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
