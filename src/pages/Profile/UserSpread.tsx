import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import SpreadPreview from "../../components/SpreadPreview";
import { UserSpreadType } from "../../utils/type";
type UserSpreadProps = {
  userSpread: UserSpreadType[] | null;
};
const UserSpread = ({ userSpread }: UserSpreadProps) => {
  if (!userSpread) return <></>;
  return (
    <section className="flex flex-wrap gap-[8px] w-[100%] mx-auto">
      <div
        className="w-[100%] mr-auto font-poppins p-1 text-yellow gap-1
          hover:underline-offset-1 flex flex-row items-center justify-end"
      >
        <Link to="/design">
          <div className="flex flex-row items-center ">
            <p className="cursor-pointer">Design Your Own </p>
            <AiOutlineArrowRight />
          </div>
        </Link>
      </div>

      {userSpread.length > 0 ? (
        userSpread.map((spread, index) => {
          return (
            <SpreadPreview
              spread={spread}
              index={index}
              type={"personal"}
              key={index}
            />
          );
        })
      ) : (
        <p className="text-pink text-3xl font-NT shadowPink tracking-widest">
          No Design Yet!
        </p>
      )}
    </section>
  );
};
export default UserSpread;
