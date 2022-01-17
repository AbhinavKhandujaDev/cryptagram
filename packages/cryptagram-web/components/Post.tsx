import Image from "next/image";
import { memo, useState, useMemo } from "react";
import { useEffect, useRef } from "react";

interface PostProps {
  post: any;
  nightmode: boolean;
  postliked: (post: any) => void;
  postSaved: (post: any) => void;
  comment: (post: any, remove?: boolean, comment?: string) => void;
}

const dotCls: string = "ratio-eq rounded-circle bg-theme-opp";

const MenuDots = memo(() => {
  return (
    <div className="d-flex btn">
      <div style={{ width: 4 }} className={dotCls} />
      <div style={{ width: 4 }} className={`${dotCls} mx-1`} />
      <div style={{ width: 4 }} className={dotCls} />
    </div>
  );
});

const Comment = memo((props: any) => {
  const { commentData } = props;
  const [expanded, setExpanded] = useState(false);

  const commentBox = useRef<any>();
  const commentSpan = useRef<any>();

  useEffect(() => {
    if (!expanded) {
      const sw = commentSpan.current.getClientRects()[0].width;
      const bw = commentBox.current.getClientRects()[0].width;
      if (sw <= bw) setExpanded(true);
      return;
    }
    commentBox.current.classList.remove("text-truncate");
  }, [expanded]);

  return (
    <div className="comment-details d-flex w-100 border-bottom py-2">
      <div className="d-flex">
        <img
          className="rounded-circle ratio-eq"
          height={25}
          src="https://i.pravatar.cc/25"
        />
        <label style={{ maxWidth: 100 }} className="fw-bold ms-2 text-truncate">
          {commentData.username}
        </label>
      </div>
      <div
        ref={commentBox}
        className="comment-box text-color ms-2 me-1 text-truncate flex-grow-1"
      >
        <span ref={commentSpan}>{commentData.comment}</span>
      </div>
      {!expanded && (
        <span
          className="link text-primary pointer flex-shrink-0 min-w-100"
          onClick={() => setExpanded(true)}
        >
          see more
        </span>
      )}
    </div>
  );
});

const Post = ({
  post,
  nightmode,
  postliked,
  postSaved,
  comment,
}: PostProps) => {
  const [state, setState] = useState({
    comment: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);
  // const pliked = useMemo(() => post.liked, [post.liked]);
  // const pbookmarked = useMemo(() => post.bookmarked, [post.bookmarked]);
  const iconCls = useMemo(() => {
    return `pointer fs-4 text-${nightmode ? "white" : "dark"} bi`;
  }, [nightmode, post.liked]);
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
              <label style={{ fontSize: "12px" }} className="text-muted">
                2 days ago
              </label>
            </div>
          </div>
          <MenuDots />
        </div>
        <div className="card-body flex-center-v bg-theme">
          <img
            className="flex-grow-1 w-100 ratio-eq rounded-3"
            src={post.postUrl}
          />
          <label className="fw-bold fs-6 mt-2">{post.caption}</label>
          <div className="flex-center-c justify-content-start w-100 my-3">
            {post.comments.map((c: any) => (
              <Comment key={c._id} commentData={c} />
            ))}
          </div>
          <div className="flex-center-h w-100">
            <i
              className={`${iconCls} bi-hand-thumbs-up${
                post.liked ? "-fill" : ""
              }`}
              onClick={() => postliked(post)}
            />
            <i className={`${iconCls} mx-4 bi bi-share`} />
            <i className={`${iconCls} bi-chat-square-quote`} />
            <i className={`${iconCls} bi-piggy-bank ms-4`} />
            <div className="flex-grow-1" />
            <i
              className={`${iconCls} bi-bookmark${
                post.bookmarked ? "-fill" : ""
              }`}
              onClick={() => postSaved(post)}
            />
          </div>
        </div>
        <div className="card-footer flex-center-h justify-content-between">
          <input
            ref={inputRef}
            className={`text-color my-1 flex-shrink-1 w-100 rounded-pill px-3 py-1 ${
              nightmode ? "bg-dark" : ""
            } border`}
            required
            placeholder="Comment..."
            onChange={(e: any) =>
              setState({ ...state, comment: e.target.value })
            }
          />
          <button
            disabled={state.comment.length === 0}
            className={`pointer btn ms-3 fs-4 text-${
              nightmode ? "white" : "dark"
            } bi bi-send ${state.comment.length === 0 ? "text-muted" : ""}`}
            onClick={(e) => {
              setState({ ...state, comment: "" });
              inputRef.current && (inputRef.current.value = "");
              comment(post, false, state.comment);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Post);
