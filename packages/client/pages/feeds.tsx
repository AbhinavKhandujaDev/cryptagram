import type {
  NextPage,
  GetServerSideProps,
  GetServerSidePropsContext,
} from "next";
import { useMemo, useEffect, memo, useState, useCallback } from "react";
import Link from "next/link";
import api from "../helper/api";
import { Post } from "../components";
import auth from "../helper/auth";
import { wallet } from "../hooks";
import showToast from "../helper/toast";

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

interface FeedsPageProps {
  loadingPosts: boolean;
  posts?: any[] | null;
}

const Feeds: NextPage = (props: any) => {
  const { nightmode, user } = props;
  const { accounts, loadWallet, transfer, contract } = wallet();
  const [state, setstate] = useState<FeedsPageProps>({
    loadingPosts: true,
    posts: null,
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
      let path = `api/post/comment?postId=${post._id}`;
      let resp = await api.post(path, { body: { comment: comment } });
      if (resp.success) {
        post.comments.push(resp.data);
        updatePost(post, "comments", post.comments);
      }
    },
    []
  );

  const support = useCallback(
    async (post: any) => {
      if (post.supported) {
        showToast.info("Already supported!");
        return;
      }
      try {
        // await loadWallet();
        let accs = await accounts();
        // console.log(contract);
        // console.log(user);
        // let res = await contract.current.methods
        //   .getSupportStatus(post._id, user._id)
        //   .call();
        // let amount = window.web3.utils.fromWei(res.amount, "ether");
        // console.log("getSupportStatus => ", amount);
        // return;
        await transfer(accs[0], post.ethAddress, post._id, user._id);
        let res = await contract.current.methods
          .getSupportStatus(post._id, user._id)
          .call();
        let amount = window.web3.utils.fromWei(res.amount, "ether");
        await api.post("/api/post/support", {
          body: { postId: post._id, amount: `${amount} eth` },
        });
        showToast.success("Supported successfully");
      } catch (error) {
        console.log("post support error => ", error);
        showToast.error("Unable to support");
      }
    },
    [contract, user]
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
    <div id="feeds" className="page py-5 flex-center-h">
      {state.posts?.length === 0 ? (
        <label className="fs-1 h-100 w-100 flex-center-h">
          No feeds available!
        </label>
      ) : (
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 py-3 d-flex flex-column align-items-center">
          {state.loadingPosts
            ? skeleton
            : state.posts?.map((post: any) => (
                <Post
                  key={post._id}
                  post={post}
                  loading={false}
                  nightmode={nightmode}
                  postliked={liked}
                  postSaved={savePost}
                  support={support}
                  comment={comment}
                />
              ))}
        </div>
      )}
      {/* <CreateButton nightmode={nightmode} /> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = auth(
  async (ctx: GetServerSidePropsContext) => {
    return {
      props: {
        user: ctx.req.cookies.user,
      },
    };
  }
);

export default memo(Feeds);
