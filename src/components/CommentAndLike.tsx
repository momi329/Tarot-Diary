import firebase from "../utils/firebase";
import Button from "./Button";
import fill from "../images/heartfill.png";
import like from "../images/heart.png";
import commentIt from "../images/comment.png";
import commenting from "../images/commenting.png";

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
    newData.forEach((data) => {
      if (data.addComment) {
        data.addComment = false;
      }
    });
    item.addComment = !item.addComment;
    newData[index] = item;
    setFriendsPosts(newData);
  };
  return (
    <div className='ml-1 mt-5'>
      <div className='flex items-center mb-2  text-pink'>
        {/* 按讚 */}
        <button
          className={`p-1 mr-2 flex-row flex items-center`}
          onClick={() => {
            likeOrUnlike(index);
          }}
        >
          <img
            src={item.like && item.like.includes(user.userUID) ? fill : like}
            alt='like'
            className='w-6 h-6'
          />
          <p className=' p-1 ml-1'>{item.like && item.like.length}</p>
        </button>
        {/* 留言 編寫 瀏覽 */}
        <button
          className='pl-3 p-1  mr-2 flex-row flex items-center'
          onClick={() => {
            commentStatusChange(item, index);
          }}
        >
          <img
            src={item.addComment ? commenting : commentIt}
            alt='comment'
            className='w-[22px] h-[21px] pb-[2px]'
          />
          <p className=' p-1 ml-1'>{item.comment && item.comment.length}</p>
        </button>
      </div>
      {item.addComment && (
        <>
          {item.comment &&
            item.comment.map((comment, q) => (
              <>
                <div
                  className='flex flex-row items-center ml-2 my-3 text-sm'
                  key={q}
                >
                  <img
                    src={comment.userImage}
                    alt={comment.user}
                    className='w-8 h-8 rounded-full'
                  />
                  <p className='font-notoSansJP font-normal  ml-4 text-yellow tracking-widest w-[25%]'>
                    {comment.userName}
                  </p>
                  <p className='font-notoSansJP font-light text-yellow tracking-widest flex-grow'>
                    {comment.comment}
                  </p>
                  {user.userUID === uid && (
                    <button
                      onClick={() => {
                        deleteComment(index, q);
                      }}
                      className='font-sygma text-yellow shadowYellow hover:underline tracking-widest mt-[6px]'
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className='w-[100%] h-[1px] bg-white opacity-40'></div>
              </>
            ))}
          <div className='flex justify-between items-center mt-6'>
            <input
              type='text'
              onChange={(e) => handleCommentChange(e)}
              value={commentChange.comment}
              className='bg-green opacity-60 pl-3 pr-10 py-2 text-yellow  w-[65%] rounded-lg '
            />
            <Button
              type={"tiny"}
              value={"Enter"}
              action={(e) => comment(e, index)}
            />
            <Button
              type={"tiny"}
              value={"Cancel"}
              action={() => alert("好！")}
            />
          </div>
        </>
      )}
    </div>
  );
};
export default CommentAndLike;
