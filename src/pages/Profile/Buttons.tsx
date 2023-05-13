import { useContext } from "react";
import { useParams } from "react-router-dom";
import UnderlineButton from "../../components/UnderlineButton";
import { AuthContext } from "../../context/authContext";
import { PageEnum } from "../../utils/type";

export const Buttons = ({ page, setPage, getDiary, getUserSpread }) => {
  const { userUID } = useContext(AuthContext);
  const { uid } = useParams();

  const switchPage = (page: string) => {
    setPage(page);
    return;
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
            switchPage("explore");
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
