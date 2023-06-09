import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import commentIt from "../images/comment.png";
import commenting from "../images/commenting.png";
import like from "../images/heart.png";
import fill from "../images/heartfill.png";
import firebase from "../utils/firebase";
import { DiaryType, FriendsPostsType } from "../utils/type";
import Alert from "./Alert";
import Button from "./Button";
type CommentAndLikeProps = {
  item: DiaryType | FriendsPostsType;
  index: number;
  commentChange: {
    user: string;
    userName: string;
    userImg: string;
    comment: string;
  };
  setCommentChange: React.Dispatch<
    React.SetStateAction<{
      user: string;
      userName: string;
      userImg: string;
      comment: string;
    }>
  >;
  openComment: number | null;
  setOpenComment: React.Dispatch<React.SetStateAction<number | null>>;
  post: DiaryType[] | FriendsPostsType[] | null;
  setPost: React.Dispatch<
    React.SetStateAction<DiaryType[] | FriendsPostsType[] | null>
  >;
};
const CommentAndLike = ({
  item,
  index,
  commentChange,
  setCommentChange,
  openComment,
  setOpenComment,
  post,
  setPost,
}: CommentAndLikeProps) => {
  const { user, userUID, alert, setAlert } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCommentChange = (e) => {
    setCommentChange({
      ...commentChange,
      user: user.userUID,
      comment: e.target.value,
      userName: user.name,
      userImg: user.image,
    });
  };
  const commented = async (comments, i: number) => {
    const newItem = { ...comments };
    newItem.comment.push(commentChange);
    await firebase.updateComment(newItem);
    setCommentChange({
      ...commentChange,
      user: userUID,
      comment: "",
    });
    setPost((prev) => {
      if (!prev) return null;
      const updateData = [...prev];
      updateData[i] = newItem;
      return updateData;
    });
  };
  const likeOrUnlike = async (liking, likeIndex) => {
    const newData = { ...liking };
    if (newData.like && newData.like.includes(user.userUID)) {
      const remove = (i) => i === user.userUID;
      const removeIndex = newData?.like.findIndex(remove);
      newData.like.splice(removeIndex);
      await firebase.updateLike(newData);
    } else {
      if (newData?.like) {
        newData.like = [...newData.like, user.userUID];
      } else {
        newData.like = [user.userUID];
      }
      if (post) {
        await firebase.updateLike(newData);
        const newPost = [...post];
        newPost[likeIndex] = newData;
        setPost(newPost);
      }
    }
  };
  const deleteComment = async (deleted, deletedIndex) => {
    await firebase.updateComment(item);
    const newData = { ...deleted };
    newData.comment.splice(deletedIndex, 1);
    setPost((prev) => {
      if (!prev) return null;
      const updateData = [...prev];
      updateData[index] = newData;
      return updateData;
    });
  };
  const commentStatusChange = async (changedIndex) => {
    openComment === changedIndex ? setOpenComment(null) : setOpenComment(index);
  };

  return (
    <>
      <div className="ml-1 mt-5" key="index">
        <div className="flex items-center mb-2  text-pink">
          <button
            className={`p-1 mr-2 flex-row flex items-center`}
            onClick={() => {
              likeOrUnlike(item, index);
            }}
          >
            <img
              src={item.like && item.like.includes(user.userUID) ? fill : like}
              alt="like"
              className="w-6 h-6"
            />
            <p className=" p-1 ml-1">{item.like ? item.like.length : 0}</p>
          </button>

          <button
            className="pl-3 p-1  mr-2 flex-row flex items-center"
            onClick={() => {
              commentStatusChange(index);
            }}
          >
            <img
              src={openComment === index ? commenting : commentIt}
              alt="comment"
              className="w-[22px] h-[21px] pb-[2px]"
            />
            <p className=" p-1 ml-1">
              {item.comment ? item.comment.length : 0}
            </p>
          </button>
        </div>

        {openComment === index && (
          <>
            {item.comment?.map((comment, q: number) => (
              <>
                <div
                  className="flex flex-row items-center ml-2 my-3 text-sm"
                  key={`${q + 1}`}
                >
                  <img
                    src={comment.userImg}
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
                    <>
                      <button
                        onClick={() => {
                          setAlert(true);
                        }}
                        key={q}
                        className="font-NT text-yellow shadowYellow hover:underline tracking-widest mt-[6px]"
                      >
                        Delete
                      </button>
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
                              action: () => {
                                deleteComment(item, q);
                                setTimeout(() => setAlert(false), 5000);
                              },
                            },
                          ]}
                        />
                      )}
                    </>
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
                action={() => commented(item, index)}
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
