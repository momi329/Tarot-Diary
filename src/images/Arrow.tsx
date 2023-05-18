type ArrowProps = {
  size: string;
  onClick: () => void;
  color: string;
};
function Arrow({ size, onClick, color }: ArrowProps) {
  return (
    <svg
      width={size}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="1"
      onClick={onClick}
    >
      <g strokeWidth="0" />
      <g strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path
          d="M21.5 16.8272L12.5294 8.35661C12.25 8.0919 11.8088 8.0919 11.5147 8.35661L2.5 16.8419"
          stroke={color}
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
export default Arrow;
