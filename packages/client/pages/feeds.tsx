import type { NextPage, GetServerSideProps } from "next";
import { useMemo, useEffect, memo, useState, useCallback } from "react";
import Link from "next/link";
import api from "../helper/api";
import { Post } from "../components";
import auth from "../helper/auth";

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
  const { nightmode } = props;
  const [state, setstate] = useState({
    loadingPosts: true,
    posts: [],
  });

  const fetchPosts = async () => {
    let res = await api.get("api/post/getAllPosts");
    return res.data;
  };

  useEffect(() => {
    (async () => {
      let resp = await fetchPosts();
      setstate((prev) => ({ ...prev, posts: resp, loadingPosts: false }));
    })();
  }, []);

  const updatePost = useCallback((post: any, key: string, value: any) => {
    setstate((prev: any) => ({
      ...prev,
      posts: prev.posts.map((p: any) => {
        return p._id === post._id ? { ...p, [key]: value } : p;
      }),
    }));
  }, []);

  const liked = useCallback(async (post: any) => {
    let path = `api/post/like?id=${post._id}&unlike=${post.liked}`;
    let resp = post.liked ? await api.delete(path) : await api.post(path);
    // let resp = await api2(
    //   `api/post/likeunlike?id=${post._id}&unlike=${post.liked}`
    // );
    if (resp.success) {
      updatePost(post, "liked", !post.liked);
    }
  }, []);

  const savePost = useCallback(async (post: any) => {
    let path = `api/post/bookmark?postId=${post._id}`;
    let resp = post.bookmarked ? await api.delete(path) : await api.post(path);
    if (resp.success) {
      updatePost(post, "bookmarked", !post.bookmarked);
    }
  }, []);

  const comment = useCallback(
    async (post: any, remove?: boolean, comment?: string) => {
      // let resp = await api2(
      //   `api/post/comment?postId=${post._id}&remove=${remove}`,
      //   { body: { comment: comment } }
      // );
      let path = `api/post/comment?postId=${post._id}`;
      let resp = await api.post(path, { body: { comment: comment } });
      if (resp.success) {
        post.comments.push(resp.data);
        updatePost(post, "comments", post.comments);
      }
    },
    []
  );

  const skeleton = useMemo(
    () =>
      Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="w-100">
            <Post
              id={`feed-post-${i}`}
              loading={true}
              post={null}
              nightmode={nightmode}
            />
          </div>
        )),
    [nightmode]
  );

  return (
    <div id="feeds" className="py-5 flex-center-h">
      <div className="col-12 col-sm-8 col-md-6 col-lg-4 py-3 d-flex flex-column align-items-center">
        {state.loadingPosts
          ? skeleton
          : state.posts.map((post: any) => (
              <Post
                key={post._id}
                post={post}
                loading={false}
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

export const getServerSideProps: GetServerSideProps = auth(async () => {
  return {
    props: {},
  };
});

export default memo(Feeds);
