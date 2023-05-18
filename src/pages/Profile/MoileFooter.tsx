import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { PageEnum } from "../../utils/type";
function MobileFooter({ page, setPage }) {
  const { user } = useContext(AuthContext);
  return (
    <div className="lg:hidden w-full h-16 bg-black/40 fixed bottom-0 flex items-center justify-center">
      <div className="w-[90%] flex flex-row items-center justify-around text-yellow text-xl font-NT tracking-wider">
        <div
          className="w-32 text-center flex flex-row gap-3 items-center justify-center cursor-pointer"
          onClick={() => setPage(PageEnum.Design)}
        >
          Spread
        </div>
        <div
          className="w-32 text-center flex flex-row gap-3 items-center justify-center mr-8  cursor-pointer"
          onClick={() => setPage(PageEnum.Explore)}
        >
          Explore
        </div>
        <div>
          <img
            onClick={() => setPage(PageEnum.EditProfile)}
            src={user.image}
            alt={user.name}
            className=" absolute right-[5%] top-[calc(50%-20px)] w-10 h-10 border boeder-yellow rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
export default MobileFooter;
