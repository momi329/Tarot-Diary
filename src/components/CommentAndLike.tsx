import firebase from "../utils/firebase";
import Button from "./Button";
const CommentAndLike = ({
  item,
  index,
  user,
  uid,
  userUID,
  commentChange,
  setCommentChange,
  friendsPosts,
  setFriendsPosts,
  page,
  visitedUser,
  setVisitedUser,
}) => {
  const handleCommentChange = (e) => {
    setCommentChange({
      ...commentChange,
      userName: user.name,
      user: user.userUID,
      comment: e.target.value,
      userImage: user.image,
    });
  };
  const comment = async (e, index) => {
    if (uid === userUID && page === 1) {
      const newFriendPost = [...friendsPosts];
      let comments = newFriendPost[index].comment;
      comments = comments ? [...comments, commentChange] : [commentChange];
      newFriendPost[index].comment = comments;
      setFriendsPosts(newFriendPost);
      await firebase.updateComment(newFriendPost[index]);
      setCommentChange({
        ...commentChange,
        comment: "",
      });
    } else {
      const newVisitedUser = [...visitedUser.diary];
      let comments = newVisitedUser[index].comment;
      comments = comments ? [...comments, commentChange] : [commentChange];
      newVisitedUser[index].comment = comments;
      console.log("newVisitedUser", newVisitedUser[index]);
      setVisitedUser({ ...visitedUser, diary: newVisitedUser });
      await firebase.updateComment(newVisitedUser[index]);
      setCommentChange({
        ...commentChange,
        comment: "",
      });
    }
  };
  const likeOrUnlike = async (index) => {
    if (uid === userUID && page === 1) {
      const newFriendPost = [...friendsPosts];
      let likes = newFriendPost[index].like;
      if (likes && likes.includes(user.userUID)) {
        //取消喜歡
        const remove = (i) => i === user.userUID;
        const removeIndex = likes.findIndex(remove);
        likes.splice(removeIndex);
      } else {
        //喜歡
        likes = likes ? [...likes, user.userUID] : [user.userUID];
      }
      newFriendPost[index].like = likes;
      await firebase.updateLike(newFriendPost[index]);
      setFriendsPosts(newFriendPost);
    } else {
    }
  };
  const deleteComment = async (index, q) => {
    if (uid === userUID && page === 1) {
      const newFriendPost = [...friendsPosts];
      newFriendPost[index].comment.splice(q, 1);
      setFriendsPosts(newFriendPost);
      await firebase.updateComment(newFriendPost[index]);
    } else {
      const newVisitedUser = [...visitedUser.diary];
      newVisitedUser[index].comment.splice(q, 1);
      setVisitedUser({ ...visitedUser, diary: newVisitedUser });
      await firebase.updateComment(newVisitedUser[index]);
    }
  };
  const commentStatusChange = (item, index) => {
    const newData = [...friendsPosts];
    item.addComment = !item.addComment;
    newData[index] = item;
    setFriendsPosts(newData);
  };
  return (
    <>
      {/* 按讚 */}
      <button
        className={`p-1 ${
          item.like && item.like.includes(user.userUID)
            ? "bg-red-100"
            : "bg-blue-100"
        }`}
        onClick={() => {
          likeOrUnlike(index);
        }}
      >
        Like
      </button>
      {/* 留言 編寫 瀏覽 */}
      <button
        className='p-1'
        onClick={() => {
          commentStatusChange(item, index);
        }}
      >
        Comment
      </button>
      {item.addComment && (
        <>
          {item.comment &&
            item.comment.map((comment, q) => (
              <div className='flex flex-row' key={q}>
                <img
                  src={comment.userImage}
                  alt={comment.user}
                  className='w-5 h-5 rounded-full'
                />
                <p>{comment.userName}</p>
                <p>{comment.comment}</p>
                {user.userUID === uid && (
                  <button
                    onClick={() => {
                      deleteComment(index, q);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          <input
            type='text'
            onChange={(e) => handleCommentChange(e)}
            value={commentChange.comment}
            // onKeyDown={(e) => comment(e, index)}
          />
          <Button
            // onClick={(e) => comment(e, index)}
            type={"confirm"}
            value={"Enter"}
            action={(e) => comment(e, index)}
          />
          <Button
            // onClick={(e) => comment(e, index)}
            type={"cancel"}
            value={"cancel"}
            action={() => alert("好！")}
          />
        </>
      )}
    </>
  );
};
export default CommentAndLike;
