import pinkFlower1 from "../images/pinkflower1.jpeg";
function Footer() {
  return (
    <div className=''>
      <div
        className='h-[800px] overflow-hidden bg-black animate-pulse
       w-screen  relative bg-clip-content  flex justify-center items-center'
      >
        <img
          src={pinkFlower1}
          alt='pinkflower1'
          className='opacity-60  rounded-3xl transform  w-[850px] absolute left-[-30px] hover:animate-pulse
          top-[-100px] z-[2] rotate-[132deg] blur-sm hover:blur-none transition duration-700 ease-in-out'
        />
        <p
          className='capitalize font-NT text-5xl text-yellow z-[3]  text-center 
         w-[60%] shadowYellow  leading-normal mb-10'
        >
          "For Those Who Feel Lost And <br></br>Uncertain, Tarot Cards Can Be a
          <br></br>
          Helpful Tool In Making Decisions."
        </p>
      </div>
    </div>
  );
}
export default Footer;
