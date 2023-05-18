type LoadingProps = {
  text: string;
};
function Loading({ text }: LoadingProps) {
  return (
    <div className="flex items-center">
      <p className="font-NT  text-pink shadowPink w-60 text-start">{text}</p>
      <div className="container self-start ml-3">
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
        <div className="block"></div>
      </div>
    </div>
  );
}
export default Loading;
