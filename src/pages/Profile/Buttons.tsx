import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import UnderlineButton from "../../components/UnderlineButton";
import { AuthContext } from "../../context/authContext";
import { PageEnum } from "../../utils/type";
type ButtonsProps = {
  page: PageEnum;
  setPage: React.Dispatch<React.SetStateAction<PageEnum>>;
  getDiary: () => void;
  getUserSpread: () => void;
};
export const Buttons = ({
  page,
  setPage,
  getDiary,
  getUserSpread,
}: ButtonsProps) => {
  const { userUID } = useContext(AuthContext);
  const { uid } = useParams();

  const switchPage = (pageSwitched: PageEnum) => {
    setPage(pageSwitched);
  };
  return (
    <div
      className="flex flex-col text-left font-NT font-light  text-yellow  
    text-2xl items-start   ml-[3%] fixed shadowYellow gap-6"
    >
      {userUID === uid && (
        <UnderlineButton
          value={"Explore"}
          type={"profile"}
          action={() => {
            switchPage(PageEnum.Explore);
          }}
          selected={page === PageEnum.Explore}
        />
      )}
      <UnderlineButton
        value={"Diary"}
        type={"profile"}
        action={() => {
          getDiary();
          if (userUID === uid) {
            switchPage(PageEnum.DiaryCalendar);
          } else {
            switchPage(PageEnum.DiaryPost);
          }
        }}
        selected={page === PageEnum.DiaryCalendar}
      />
      <UnderlineButton
        value={"Design"}
        type={"profile"}
        action={() => {
          getUserSpread();
          switchPage(PageEnum.Design);
        }}
        selected={page === PageEnum.Design}
      />
    </div>
  );
};
