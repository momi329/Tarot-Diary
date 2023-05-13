import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import UnderlineInput from "../../components/UnderlineInput";
import { AuthContext } from "../../context/authContext";
import { DesignSpreadData } from "../../utils/type";
import { ActionType } from "./Spread";
import useGetDesign from "./hooks/useGetDesign";

type DispatchAction = {
  type: ActionType;
};

type LowerAreaProps = {
  type: ActionType;
  dispatch: (action: DispatchAction) => void;
  data: DesignSpreadData;
};

function LowerArea({ type, dispatch }: LowerAreaProps) {
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const { spreadData, setSpreadData, divinedData, setDivinedData } =
    useGetDesign();

  return (
    <>
      {type === "preview" && (
        <div className="flex gap-3 mb-8 ml-8 w-[280px]">
          <Button
            action={() => {
              if (!isLogin) {
                navigate(`/signin`);
              }
              dispatch({ type: ActionType.Start });
            }}
            value={"Start"}
            type={"big"}
          />
        </div>
      )}
      {(type === "start" || type === "end") && (
        <div className="w-[25%] mb-4  ml-8">
          <UnderlineInput
            name="請寫下你的問題："
            value={divinedData?.question || ""}
            inputType={"text"}
            action={(e) =>
              setDivinedData({
                ...divinedData,
                question: e.target.value,
              })
            }
            placeholder="Write Your Question"
            disabled={type === ActionType.End}
          />
        </div>
      )}
    </>
  );
}

export default LowerArea;
