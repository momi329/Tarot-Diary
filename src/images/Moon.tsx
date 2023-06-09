type MoonProps = {
  color: string;
  width: string;
  height: string;
};
function Moon({ color, width, height }: MoonProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 47 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.6204 2.29024C29.5531 2.29025 40.0366 12.8121 40.0366 25.7923C40.0366 38.7719 29.5531 49.2938 16.6204 49.2938C10.1207 49.2938 4.24227 46.6333 6.1518e-05 42.3415C4.74936 48.2296 12.001 52 20.137 52C34.4442 52 46.043 40.3594 46.043 26C46.043 11.6406 34.4442 2.49929e-05 20.137 2.28835e-05C13.067 2.18412e-05 6.66532 2.84931 1.99096 7.45736C6.00023 4.23097 11.0818 2.29024 16.6204 2.29024Z"
        fill={color}
      />
    </svg>
  );
}
export default Moon;
