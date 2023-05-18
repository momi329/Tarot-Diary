import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import UnderlineButton from "../../components/UnderlineButton";
import { AuthContext } from "../../context/authContext";
import { ActionEnum, SpreadData } from "../../utils/type";
import Design from "../Design/Design";
type SpreadInfoProps = {
  spreadData: SpreadData | null;
  type: ActionEnum;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  edit: boolean;
};
function SpreadInfo({ spreadData, type, setEdit, edit }: SpreadInfoProps) {
  const { userUID } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!spreadData) return <></>;
  return (
    <>
      <div className="flex flex-row justify-between mx-8 mt-8">
        <span className="flex flex-col">
          <h1
            className={`text-3xl font-NT  tracking-widest mt-4 
        ${spreadData?.userUID === "all" ? "shadowYellow text-5xl" : ""}`}
          >
            {spreadData?.title}
          </h1>
          <p className="w-[60%] leading-7 text-sm mt-5">
            {spreadData?.description}
          </p>
          <div className="font-NT text-yellow text-2xl mt-8 mb-5 tracking-widest shadowYellow ">
            PICK{" "}
            {spreadData?.spread.reduce(
              (acc: number, crr) => (crr === 0 ? acc : acc + 1),
              0
            )}{" "}
            CARDS
          </div>
        </span>
        {type === ActionEnum.Preview && userUID === spreadData?.userUID ? (
          <Button
            action={() => {
              setEdit(true);
            }}
            value={"Edit"}
            type={"little"}
          />
        ) : (
          spreadData?.author && (
            <div>
              <div>Author</div>
              <UnderlineButton
                value={spreadData.author}
                type={"memberPage"}
                action={() => navigate(`/profile/${spreadData.userUID}`)}
              />
            </div>
          )
        )}
      </div>
      {spreadData?.userUID === userUID && edit && (
        <div
          className="w-[110%] h-[100%] overflow-y-scroll p-16 bg-darkPink z-20 mx-auto fixed top-1/2 left-1/2 
              transform -translate-x-1/2 -translate-y-1/2"
        >
          <Design setEdit={setEdit} edit={edit} spreadData={spreadData} />
        </div>
      )}
    </>
  );
}
export default SpreadInfo;
