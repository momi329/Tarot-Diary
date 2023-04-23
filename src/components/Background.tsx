import pinkFlower1 from "../images/pinkflower1.jpeg";

function Background() {
  const isProfile = window.location.pathname.includes("/profile/");
  return (
    <>
      <div
        className={`${
          isProfile ? "bg-green" : "bg-black"
        } m-0   text-white font-notoSansJP h-[100%] w-[100vw] fixed z-[-1]`}
      ></div>
      {!isProfile && (
        <img
          src={pinkFlower1}
          alt='pinkflower1'
          className='opacity-60 rounded-3xl transform rotate-[162] w-[980px] absolute left-[-80px] top-[-500px] z-[-1]'
        />
      )}
      <div
        className='bg-pink rounded-full opacity-50 blur-[250px] w-[900px] h-[600px] 
      fixed bottom-[-100px] right-[-300px] rotate-12 z-[-1]'
      ></div>
    </>
  );
}
export default Background;
