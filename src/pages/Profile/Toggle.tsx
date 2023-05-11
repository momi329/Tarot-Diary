function Toggle({ page, setPage }) {
  return (
    <div className="flex flex-row items-center self-end gap-2">
      <p className="text-yellow font-NT text-lg shadowYellow tracking-widest">
        Diary
      </p>
      <div className="inline-block relative w-[48px] h-[24px] m-1 my-3 ">
        <input
          id="switchUpload"
          type="checkbox"
          checked={page === "diaryCalender"}
          onChange={() => {
            page === "diaryPost"
              ? setPage("diaryCalender")
              : setPage("diaryPost");
          }}
          className="opacity-0 w-0 h-0"
        />
        <label htmlFor="switchUpload">
          <div
            className={`absolute top-0 left-0 right-0 bottom-0 rounded-full transition duration-300 ${
              page === "diaryCalender"
                ? "bg-pink bg-opacity-60"
                : "bg-yellow bg-opacity-40"
            }`}
          >
            <div
              className={`absolute bottom-[2px] left-[2px] w-5 h-5 bg-white rounded-full transition duration-300 transform ${
                page === "diaryCalender"
                  ? "translate-x-[24px]"
                  : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>
      <p className="text-yellow font-NT text-lg shadowYellow tracking-widest">
        Calender
      </p>
    </div>
  );
}
export default Toggle;
