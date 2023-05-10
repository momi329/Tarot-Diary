import firebase from "../utils/firebase";
import Button from "./Button";
import fill from "../images/heartfill.png";
import like from "../images/heart.png";
import commentIt from "../images/comment.png";
import commenting from "../images/commenting.png";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

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
  const { alert, setAlert } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleCommentChange = (e) => {
    setCommentChange({
      ...commentChange,
      user: user.userUID,
      comment: e.target.value,
      userName: user.name,
      userImage: user.image,
    });
  };
  const comment = async (index) => {
    if (uid === userUID && page === 1) {
      const newFriendPost = [...friendsPosts];
      let comments = newFriendPost[index].comment;
      comments = comments ? [...comments, commentChange] : [commentChange];
      newFriendPost[index].comment = comments;
      setFriendsPosts(newFriendPost);
      await firebase.updateComment(newFriendPost[index]);
      setCommentChange({
        ...commentChange,
        user: userUID,
        comment: "",
      });
    } else {
      const newVisitedUser = [...visitedUser.diary];
      let comments = newVisitedUser[index].comment;
      comments = comments ? [...comments, commentChange] : [commentChange];
      newVisitedUser[index].comment = comments;
      setVisitedUser({ ...visitedUser, diary: newVisitedUser });
      await firebase.updateComment(newVisitedUser[index]);
      setCommentChange({
        ...commentChange,
        user: userUID,
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
      const newFriendPost = [...visitedUser.diary];
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
      setVisitedUser({ ...visitedUser, diary: newFriendPost });
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
  const commentStatusChange = async (item, index) => {
    let newData;
    if (uid === userUID) {
      newData = [...friendsPosts];
    } else {
      newData = [...visitedUser.diary];
    }
    if (item.addComment === true) {
      item.addComment = false;
      newData[index] = item;
      uid === userUID
        ? setFriendsPosts(newData)
        : setVisitedUser({ ...visitedUser, diary: newData });
      // setFriendsPosts(newData);
    } else {
      //todo
      if (!newData[index].comment) {
        newData.forEach((data) => {
          if (data.addComment) {
            data.addComment = false;
          }
        });
        item.addComment = !item.addComment;
        newData[index] = item;
        uid === userUID
          ? setFriendsPosts(newData)
          : setVisitedUser({ ...visitedUser, diary: newData });

        // setFriendsPosts(newData);
      } else if (newData[index].comment.length === 0) {
        newData.forEach((data) => {
          if (data.addComment) {
            data.addComment = false;
          }
        });
        item.addComment = !item.addComment;
        newData[index] = item;
        uid === userUID
          ? setFriendsPosts(newData)
          : setVisitedUser({ ...visitedUser, diary: newData });

        // setFriendsPosts(newData);
      } else {
        const comments = await firebase.getCommentsProfile(item.comment);
        newData.forEach((data) => {
          if (data.addComment) {
            data.addComment = false;
          }
        });
        item.addComment = !item.addComment;
        item.comment = comments;
        newData[index] = item;
        uid === userUID
          ? setFriendsPosts(newData)
          : setVisitedUser({ ...visitedUser, diary: newData });

        // setFriendsPosts(newData);
      }
    }
  };
  return (
    <>
      <div className="ml-1 mt-5" key="index">
        <div className="flex items-center mb-2  text-pink">
          {/* 按讚 */}
          <button
            className={`p-1 mr-2 flex-row flex items-center`}
            onClick={() => {
              likeOrUnlike(index);
            }}
          >
            <img
              src={item.like && item.like.includes(user.userUID) ? fill : like}
              alt="like"
              className="w-6 h-6"
            />
            <p className=" p-1 ml-1">{item.like ? item.like.length : 0}</p>
          </button>
          {/* 留言 編寫 瀏覽 */}
          <button
            className="pl-3 p-1  mr-2 flex-row flex items-center"
            onClick={() => {
              commentStatusChange(item, index);
            }}
          >
            <img
              src={item.addComment ? commenting : commentIt}
              alt="comment"
              className="w-[22px] h-[21px] pb-[2px]"
            />
            <p className=" p-1 ml-1">
              {item.comment ? item.comment.length : 0}
            </p>
          </button>
        </div>
        {item.addComment && (
          <>
            {item.comment &&
              item.comment.map((comment, q) => (
                <>
                  <div
                    className="flex flex-row items-center ml-2 my-3 text-sm"
                    key={`${q}+1`}
                  >
                    <img
                      src={comment.userImage}
                      alt={comment.user}
                      className="w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => navigate(`/profile/${comment.user}`)}
                    />
                    <p
                      className="font-notoSansJP font-normal  ml-4 text-yellow tracking-widest
                    whitespace-normal w-28 mr-2"
                    >
                      {comment.userName}
                    </p>
                    <p
                      className="font-notoSansJP font-normal text-yellow tracking-widest 
                  flex-grow w-[300px] break-words  mr-2 whitespace-pre-line"
                    >
                      {comment.comment}
                    </p>
                    {user.userUID === comment.user && (
                      <button
                        onClick={() => {
                          setAlert(true);
                          // deleteComment(index, q);
                        }}
                        className="font-NT text-yellow shadowYellow hover:underline tracking-widest mt-[6px]"
                      >
                        Delete
                      </button>
                    )}
                    {alert && (
                      <Alert
                        value={"Are you sure you want to delete?"}
                        buttonValue={[
                          {
                            value: "Cancel",
                            type: "little",
                            action: () => setAlert(false),
                          },
                          {
                            value: "Confirm",
                            type: "littlePink",
                            action: (q) => {
                              deleteComment(index, q);
                              setTimeout(() => setAlert(false), 5000);
                            },
                          },
                        ]}
                      />
                    )}
                  </div>
                  <div
                    className="w-[100%] h-[1px] bg-white opacity-40"
                    key={Math.floor(Math.random() * 900) + 100}
                  />
                </>
              ))}
            <div className="group relative flex justify-between items-center mt-6">
              <textarea
                id="comment"
                name="comment"
                rows={2}
                cols={20}
                onChange={(e) => handleCommentChange(e)}
                value={commentChange.comment}
                className="bg-green opacity-60 pl-3 py-2 text-yellow mr-2 w-84 rounded-lg w-[450px] outline-none"
              />
              <Button
                type={"tiny"}
                value={"Enter"}
                disabled={commentChange.comment === ""}
                action={() => comment(index)}
              />
              <div
                className={`${
                  commentChange.comment === ""
                    ? "opacity-0 group-hover:opacity-100"
                    : "opacity-0"
                } absolute top-[-30px] right-[-4px] bg-black/40 text-gray text-sm font-NT p-1 px-2 rounded-lg`}
              >
                ！請輸入文字
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CommentAndLike;
