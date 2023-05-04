import lightCard from "../images/card-light.png";
import { useContext } from "react";
import { LoadingContext } from "../context/loadingContext";
function LoadingPage() {
  const { isLoading } = useContext(LoadingContext);
  console.log(isLoading);
  return (
    <div className='w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center  '>
      <div className='bg-black/90 w-full h-full backdrop-blur-lg fixed top-0 left-0' />
      <div className='spinner '>
        <div
          className=' w-[140px] h-[242px] m-2  object-contain card'
          style={{
            background: ` center / contain no-repeat url(${lightCard})`,
          }}
        />
        <p className=' text-3xl text-yellow shadowYellow font-NT tracking-widest mt-2'>
          Loading...
        </p>
      </div>
    </div>
  );
}
export default LoadingPage;
