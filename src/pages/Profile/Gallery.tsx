import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button";
import CommentAndLike from "../../components/CommentAndLike";
import Editor from "../../components/Editor/Editor";
import Viewer from "../../components/Editor/Viewer";
import Loading from "../../components/Loading";
import SpreadPreview from "../../components/SpreadPreview";
import UnderlineButton from "../../components/UnderlineButton";
import { AuthContext } from "../../context/authContext";
import Star from "../../images/Star";
import cards from "../../tarotcard/tarot-images";
import { DiaryType, FriendsPostsType, GalleryProps } from "../../utils/type";
import { SpreadPlace } from "../Spread/SpreadPlace";
import GalleryHeader from "./GalleryHeader";
import GalleryNoDiary from "./GalleryNoDiary";
import GallerySkeleton from "./GallerySkeleton";

const Gallery = ({ data, page }: GalleryProps) => {
  const [edit, setEdit] = useState<boolean[] | null>(null);
  const [newEdit, setNewEdit] = useState({ secret: false, content: "" });
  const [commentChange, setCommentChange] = useState({
    user: "",
    userName: "",
    userImg: "",
    comment: "",
  });
  const [openComment, setOpenComment] = useState<number | null>(null);
  const { userUID, loading, setLoading } = useContext(AuthContext);
  const [post, setPost] = useState<DiaryType[] | FriendsPostsType[] | null>(
    null
  );
  const [ifMore, setIfMore] = useState(true);
  const tarot = cards.cards;
  const navigate = useNavigate();
  const { uid } = useParams();

  useEffect(() => {
    if (!data) return;
    const newData = [...data];
    newData
      .sort(function (a, b) {
        return (a.time?.seconds || 0) - (b.time?.seconds || 0);
      })
      .reverse();
    newData && setEdit(Array(newData.length).fill(false));
    if (newData.length < 5) {
      setPost(newData as DiaryType[] | FriendsPostsType[]);
    } else {
      setPost(newData.slice(0, 5) as DiaryType[] | FriendsPostsType[]);
    }
  }, [data, page]);

  const onEditorContentChanged = (content) => {
    setNewEdit({ ...newEdit, content: content.markdown });
  };

  const seeMore = () => {
    if (!post) return;
    if (!data) return;
    setLoading(true);
    const newData = [...data];
    newData
      .sort(function (a, b) {
        return (a.time?.seconds || 0) - (b.time?.seconds || 0);
      })
      .reverse();
    const more = post?.length + 5;
    newData?.length < 5 && setIfMore(false);
    setTimeout(() => {
      newData?.length < more && setIfMore(false);
      setPost(newData?.slice(0, more) as DiaryType[] | FriendsPostsType[]);
      setLoading(false);
    }, 1500);
  };

  const seeMoreGPT = (index: number) => {
    if (!post) return;
    const newPost = [...post];
    newPost[index].seeMore = !newPost[index].seeMore;
    setPost(newPost as DiaryType[] | FriendsPostsType[]);
  };

  if (!post) return <GallerySkeleton />;
  if (userUID === uid && !data) return <GalleryNoDiary />;
  if (userUID !== uid && post.length === 0) {
    return (
      <p className="sm:text-4xl text-5xl text-yellow font-NT shadowYellow mt-2">
        No Diary Yet {" : ("}
      </p>
    );
  }

  return (
    <>
      <div className="flex gap-4 flex-col  w-[100%] ">
        {post.map((item: DiaryType | FriendsPostsType, index: number) => (
          <div
            key={index}
            className="bg-yellow-100 sm:px-3 sm:py-2 px-6 py-5 relative  bg-pink bg-opacity-30 "
          >
            <GalleryHeader
              item={item}
              index={index}
              edit={edit}
              setEdit={setEdit}
              post={post}
              setPost={setPost}
              newEdit={newEdit}
              setNewEdit={setNewEdit}
            />
            {item.user && (
              <div className="sm:mt-2 w-[100%] h-[1px] bg-white bg-opacity-40  mt-3 " />
            )}
            {item.question ? (
              <>
                <h1 className="sm:mt-3 sm:text-sm ml-4 mt-4 mb-4 h-4 pb-10 font-notoSansJP text-base text-yellow font-normal tracking-widest">
                  {item.question === "" ? "" : item.question}
                </h1>

                {item.spread.includes(0) ? (
                  <div className="tinyL:scale-90 tiny:hidden">
                    <SpreadPlace type={item} tarot={tarot} size={"medium"} />
                  </div>
                ) : (
                  <div className="gap-2 flex-row flex   w-[100%] flex-wrap justify-center">
                    {item.spread
                      .filter((value) => typeof value !== "number")
                      .map((q, i) => {
                        if (typeof q !== "number") {
                          return (
                            <div
                              className="sm:scale-90 w-[130px] text-yellow font-NT tracking-wider shadowYellow"
                              key={i}
                            >
                              <img
                                src={(q.card && tarot[q.card].img) || ""}
                                alt={(q.card && tarot[q.card].name) || ""}
                                className={`opacity-70 z-0 ${
                                  q.reverse ? "rotate-180" : ""
                                }`}
                              />
                              <p className="mt-3">
                                {q.card && tarot[q.card].name}
                              </p>
                              <p className="text-sm font-notoSansJP font-light tracking-widest">
                                {q.value}
                              </p>
                            </div>
                          );
                        }
                      })}
                  </div>
                )}

                <span className="sm:flex-col flex flex-row justify-between mt-8">
                  <div className="sm:w-full flex flex-col w-[48%] items-center">
                    <p className="ml-3 mb-2 shadowYellow text-yellow font-NT  tracking-wider text-lg">
                      Ask AI
                    </p>
                    <div className=" sm:w-full ml-3 text-sm font-notoSansJP leading-6 text-gray whitespace-pre-line ">
                      {" "}
                      {item.askGpt && item.seeMore
                        ? item.askGpt && (
                            <span>
                              {item.askGpt}
                              {item.askGpt && item.askGpt.length > 200 && (
                                <span
                                  className="text-pink cursor-pointer relative group font-NT shadowPink tracking-widest"
                                  onClick={() => {
                                    seeMoreGPT(index);
                                  }}
                                >
                                  close
                                  <div className="w-0 h-[1px] absolute bottom-0 left-0 bg-pink group-hover:w-full duration-300" />
                                </span>
                              )}
                            </span>
                          )
                        : item.askGpt && (
                            <span>
                              {item.askGpt.length < 200
                                ? item.askGpt
                                : `${item.askGpt.slice(0, 200)}...`}

                              {item.askGpt && item.askGpt.length > 200 && (
                                <span
                                  className="text-pink cursor-pointer relative group font-NT shadowPink tracking-widest"
                                  onClick={() => {
                                    console.log(index, "here");
                                    seeMoreGPT(index);
                                  }}
                                >
                                  see more
                                  <div className="w-0 h-[1px] absolute bottom-0 left-0 bg-pink group-hover:w-full duration-300" />
                                </span>
                              )}
                            </span>
                          )}
                    </div>
                  </div>
                  <div className="sm:hidden flex flex-col gap-2 justify-between items-center ">
                    <Star color={"#E18EA5"} />
                    <div className=" my-3 w-[1px] bg-pink h-full" />
                    <Star color={"#E18EA5"} />
                  </div>
                  <div className="sm:mt-5 sm:w-full  flex flex-col w-[48%] items-center">
                    <p className="ml-3 mb-2 shadowYellow text-yellow font-NT  tracking-wider text-lg">
                      Memo
                    </p>
                    {userUID === uid && edit && edit[index] ? (
                      <Editor
                        value={item.content}
                        onChange={onEditorContentChanged}
                      />
                    ) : (
                      <Viewer value={item.content ? item.content : ""} />
                    )}
                  </div>
                </span>
                <CommentAndLike
                  item={item}
                  index={index}
                  commentChange={commentChange}
                  setCommentChange={setCommentChange}
                  openComment={openComment}
                  setOpenComment={setOpenComment}
                  post={post}
                  setPost={setPost}
                />
              </>
            ) : (
              <div>
                {item.user && (
                  <div className="flex flex-row m-2 align-center  ">
                    <SpreadPreview type={"personal"} spread={item} index={0} />

                    <div className="flex-end w-[60%] flex-grow-1 m-2 text-gray  ml-5">
                      <div className="mb-2 text-base font-normal tracking-widest">
                        我新增了一個
                        <span
                          className="text-yellow font-normal hover:underline-offset-2 duration-200 cursor-pointer"
                          onClick={() => {
                            navigate(`/spread/${item.spreadId}`);
                          }}
                        >
                          {" "}
                          {item.title}{" "}
                        </span>
                        <UnderlineButton
                          value={item.title}
                          type={"profile"}
                          action={() => {
                            navigate(`/spread/${item.spreadId}`);
                          }}
                        />
                        牌陣<br></br>趕快來占卜喔！
                      </div>
                      <span className="text-gray text-sm mt-2">
                        {" "}
                        {item.description && item.description.slice(0, 60)}...
                      </span>

                      <span
                        className="text-pink cursor-pointer relative group font-NT shadowPink tracking-widest"
                        onClick={() => navigate(`/spread/${item.spreadId}`)}
                      >
                        Go Tarot
                        <div className="w-0 h-[1px] absolute bottom-0 left-0 bg-pink group-hover:w-full duration-300"></div>
                      </span>
                    </div>
                  </div>
                )}
                <CommentAndLike
                  item={item}
                  index={index}
                  commentChange={commentChange}
                  setCommentChange={setCommentChange}
                  openComment={openComment}
                  setOpenComment={setOpenComment}
                  post={post}
                  setPost={setPost}
                />
              </div>
            )}
          </div>
        ))}
        <div className="w-full flex items-center justify-center mt-7 mb-10">
          {loading ? (
            <div className="mx-auto">
              <Loading text={""} />
            </div>
          ) : ifMore ? (
            <div className="w-[250px] mx-auto">
              <Button
                type={"big"}
                value={"See More"}
                action={() => {
                  seeMore();
                }}
              />
            </div>
          ) : (
            <p className="text-xl text-pink font-NT shadowPink tracking-widest">
              {"No More Diary :(("}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Gallery;
