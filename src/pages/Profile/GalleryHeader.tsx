import { useContext } from "react";
import { Link } from "react-router-dom";
import Alert from "../../components/Alert";
import UnderlineButton from "../../components/UnderlineButton";
import { AuthContext } from "../../context/authContext";
import Moon from "../../images/Moon";
import firebase from "../../utils/firebase";
import { formatTimestamp } from "../../utils/function";
import type { DiaryType, FriendsPostsType } from "../../utils/type";
function GalleryHeader({
  item,
  index,
  edit,
  setEdit,
  post,
  setPost,
  newEdit,
  setNewEdit,
}) {
  const { userUID, alert, setAlert } = useContext(AuthContext);

  const deletePost = async (userUID: string, docId: string) => {
    await firebase.deleteDiary(userUID, docId);
    if (!post) return;
    const newData = [...post];
    const deleteIndex = newData.findIndex((post) => post.docId === docId);
    const target = newData.splice(deleteIndex, 1);
    console.log("deleted", target);
    setPost(newData as DiaryType[] | FriendsPostsType[]);
    setAlert(false);
  };

  const handleSave = async (index) => {
    if (!post) return;
    await firebase.updateDiary(userUID, post[index].docId, newEdit);
    post[index].content = newEdit.content;
    if (!edit) return;
    const newData = [...edit];
    newData[index] = false;
    setEdit(newData);
  };

  const handleEdit = (index, secret) => {
    if (!edit) return;
    const newData = [...edit];
    newData[index] = true;
    setEdit(newData);
    setNewEdit({ ...newEdit, secret: secret });
  };

  return (
    <div className="w-full flex flex-row justify-between items-center">
      {item.user && (
        <Link to={`/profile/${item.user}`}>
          <div className="flex flex-row  align-center ">
            <img
              src={item.userName && item.userImg}
              alt={item.userName}
              className="sm:y-10 sm:mr-4 rounded-full w-[50px] h-[50px] mr-[16px]"
            />
            <p className="sm:text-sm font-notoSansJP text-yellow self-center">
              {item.userName}
            </p>
            <p
              className="sm:text-sm font-NT text-gray shadowGray self-center
        leading-normal tracking-widest mt-1"
            >
              ・{formatTimestamp(item.time)}
            </p>
          </div>
        </Link>
      )}

      {userUID === item.user && item.docId && (
        <>
          <div className="tiny:scale-90 tiny:top-16 tiny:right-3 absolute top-[90px] right-8  ">
            <UnderlineButton
              type={"meanings"}
              action={() => {
                edit && edit[index]
                  ? handleSave(index)
                  : handleEdit(index, item.secret);
              }}
              value={edit && edit[index] ? "Save" : "Edit"}
            />
          </div>

          <div className="tiny:scale-90 tiny:top-16 tiny:right-12 absolute top-[90px] right-[90px] ">
            <UnderlineButton
              type={"meanings"}
              action={() => setAlert(true)}
              value={"Delete"}
            />
          </div>

          {edit && !edit[index] && alert && (
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
                    item.docId && deletePost(userUID, item.docId);
                  },
                },
              ]}
            />
          )}
          {edit && edit[index] ? (
            <select
              className="sm:text-sm outline-none font-NT text-yellow pl-2 pr-20 bg-green ml-auto
       w-[30%] h-[38px] pt-1 text-base item-end bg-opacity-90 rounded-md tracking-widest inline-block"
              disabled={!edit[index]}
              onChange={(e) => {
                setNewEdit({
                  ...newEdit,
                  secret: e.target.value === "true",
                });
              }}
              value={item.secret ? "true" : "false"}
            >
              <option value="false">Public</option>
              <option value="true">Private</option>
            </select>
          ) : (
            <div
              className="tiny:hidden sm:text-sm font-NT text-yellow tracking-widest shadowYellow text-base flex
          flex-row items-center justify-center"
            >
              {item.secret ? "Private" : "Public"}・
              <div className="pb-[2px] ">
                <Moon color={"#9F8761"} width={20} height={20} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default GalleryHeader;
