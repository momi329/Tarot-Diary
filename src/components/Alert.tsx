import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import Star from "../images/Star";
import Button from "./Button";

function Alert({ value, buttonValue }) {
  const { alert, setAlert } = useContext(AuthContext);
  return (
    <div className='w-screen h-screen fixed top-0 left-0 z-50 flex items-center justify-center'>
      <div
        className={`w-full  h-screen fixed transition bg-black/30 backdrop-blur-sm `}
      />

      <div
        className='w-1/3 h-1/3 bg-pink/20 z-[60] relative flex flex-col items-center justify-center gap-4'
        onClick={() => {
          setAlert(false);
        }}
      >
        <div
          className='cursor-pointer absolute right-[50px] top-[35px]'
          onClick={() => {
            setAlert(false);
          }}
        >
          <div className='absolute top-0 w-10 h-[1px] bg-white rotate-[-45deg]' />
          <div className='absolute top-0 w-10 h-[1px] bg-white rotate-[45deg]' />
        </div>
        <div className='flex flex-row items-center justify-center mt-5 gap-4'>
          <Star color={"#E18EA5"} />
          <p className='font-NT text-2xl text-yellow shadowYellow tracking-widest'>
            {value}
          </p>
          <Star color={"#E18EA5"} />
        </div>
        <div className='flex flex-row gap-3'>
          {buttonValue.map((button, index) => (
            <Button
              type={button.type}
              value={button.value}
              action={() => {
                button.action();
              }}
              disabled={false}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Alert;
