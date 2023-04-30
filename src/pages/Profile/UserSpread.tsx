import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import SpreadPreview from "../../components/SpreadPreview";

const UserSpread = ({ userDesign, visitedUser }) => {
  return (
    <section className='flex flex-wrap gap-[8px] w-[100%] mx-auto'>
      <div
        className='w-[100%] mr-auto font-poppins p-1 text-yellow gap-1
          hover:underline-offset-1 flex flex-row items-center justify-end'
      >
        <Link to='/design'>
          <div className='flex flex-row'>
            <p>Design Your Own </p>
            <AiOutlineArrowRight />
          </div>
        </Link>
      </div>
      {userDesign.map((spread, index) => {
        return (
          <SpreadPreview
            spread={spread}
            index={index}
            type={"personal"}
            key={index}
          />
        );
      })}
    </section>
  );
};
export default UserSpread;
