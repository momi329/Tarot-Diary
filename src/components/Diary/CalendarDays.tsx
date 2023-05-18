import React from "react";
import { Day, DiaryType } from "../../utils/type";
type CalendarDaysProps = {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  diaryData: DiaryType[] | Day[];
  setDayDiary: React.Dispatch<React.SetStateAction<Day | object>>;
  dayDairy: Day | object;
  setTargetDiary?: React.Dispatch<React.SetStateAction<DiaryType | null>>;
};
function CalendarDays({
  selectedDate,
  setSelectedDate,
  diaryData,
  setDayDiary,
  setTargetDiary,
}: CalendarDaysProps) {
  const startOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );

  const endOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  );
  const startWeekday = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const days: React.ReactNode[] = [];
  const clickedDiary = (day: Day | object, i: number) => {
    if (day !== undefined) {
      setDayDiary(day);
      setTargetDiary && setTargetDiary(diaryData[i] as DiaryType);
    }
  };

  for (let i = 1; i <= startWeekday; i++) {
    days.push(
      <div
        key={`empty-${i}`}
        className="w-[100%] h-[60px] flex cursor-default"
      />
    );
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      i
    );
    const isToday = date.toDateString() === new Date().toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // 將時間設定為 0
    const targetSeconds = Math.floor(targetDate.getTime() / 1000);

    const handleClick = () => {
      setSelectedDate(date);
    };
    days.push(
      <>
        <div
          key={`day-${i}`}
          className={`w-[100%] h-[60px] flex  pl-1 pt-1 rounded-b-lg ${
            isToday ? "calendar__day--today" : ""
          } ${isSelected ? "" : ""}`}
          onClick={handleClick}
        >
          {i}
          <div className="flex flex-wrap gap-[2px] ml-2 flex-start">
            {diaryData.map((day, diaryIndex) => {
              const daySeconds = day.time.seconds;
              if (
                targetSeconds <= daySeconds &&
                daySeconds < targetSeconds + 86400
              ) {
                return (
                  <button
                    onClick={() => clickedDiary(day, diaryIndex)}
                    key={i}
                    title={day.question}
                    className="group w-4 h-4 p-[2px] rounded-full bg-pink 
                    bg-opacity-60 z-10 relative cursor-pointer"
                  >
                    <div
                      className="group-hover:opacity-100 absolute text-sm top-4 left-4 p-2 text-start
                    opacity-0  min-w-[150px] min-h-[20px] text-yellow bg-pink/80  rounded-xl tracking-widest"
                    >
                      ・{day.question}
                    </div>
                  </button>
                );
              }

              return null;
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="grid grid-cols-7  gap-4 p-2 text-yellow
     bg-black bg-opacity-40 rounded-b-sm mb-10"
      key="days"
    >
      {days}
    </div>
  );
}
export default CalendarDays;
