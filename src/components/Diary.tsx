import { Timestamp } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import "../Calander.css";
import { AuthContext } from "../context/authContext";
import firebase from "../utils/firebase";
import { DiaryType } from "../utils/type";
import { Post } from "./Post";
type Props = {
  selectedDate: Date;
  prevMonth: () => void;
  nextMonth: () => void;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  diaryData: object[] | Day[];
  isDiaryOpen: boolean;
  setIsDiaryOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDayDiary: React.Dispatch<React.SetStateAction<Day | object>>;
  dayDairy: Day | object;
  setTargetDiary?: React.Dispatch<React.SetStateAction<DiaryType | null>>;
};
type Day = {
  title: string;
  card: number;
  reverse: boolean;
  secret: boolean;
  time: Timestamp;
  content: string;
};

function Diary() {
  const { userUID } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [diaryData, setDiaryData] = useState<DiaryType[] | []>([]);
  const [isDiaryOpen, setIsDiaryOpen] = useState<boolean>(false);
  const [dayDairy, setDayDiary] = useState({});
  const [targetDiary, setTargetDiary] = useState<DiaryType | null>(null);
  const prevMonth = () => {
    setSelectedDate((prevDate) => {
      const getPrevMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      return getPrevMonth;
    });
  };
  const nextMonth = () => {
    setSelectedDate((prevDate) => {
      const getNextMonth = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      return getNextMonth;
    });
  };

  useEffect(() => {
    console.log(targetDiary, "target");
    async function getUserDiary() {
      const docSnap = await firebase.getUserDiary(userUID);
      setDiaryData(docSnap);
    }
    getUserDiary();
  }, [targetDiary]);

  return (
    <div className="w-[100%] rounded-xl font-NT bg-opacity-60">
      <CalendarHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        diaryData={diaryData}
        setIsDiaryOpen={setIsDiaryOpen}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        isDiaryOpen={isDiaryOpen}
        setDayDiary={setDayDiary}
        dayDairy={dayDairy}
      />
      <CalendarWeekdays />
      <CalendarDays
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        diaryData={diaryData}
        setIsDiaryOpen={setIsDiaryOpen}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        isDiaryOpen={isDiaryOpen}
        setDayDiary={setDayDiary}
        dayDairy={dayDairy}
        setTargetDiary={setTargetDiary}
      />
      {targetDiary !== null && (
        <Post
          targetDiary={targetDiary}
          setTargetDiary={setTargetDiary}
          setDiaryData={setDiaryData}
        />
      )}
    </div>
  );
}

function CalendarHeader({ selectedDate, prevMonth, nextMonth }: Props) {
  const year = selectedDate.getFullYear();
  const monthNumber = selectedDate.getMonth() + 1;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[selectedDate.getMonth()];
  const monthYear = `${year}.${monthNumber},${monthName}`;

  return (
    <div
      className="flex justify-between items-center 
    p-1 bg-black rounded-sm text-yellow pt-2 rounde-t-lg "
    >
      <button
        className="cursor-pointer text-notoSansJP shadowYellow text-yellow p-2"
        onClick={prevMonth}
      >
        &lt;
      </button>
      <div className="text-lg yellowShadow">{monthYear}</div>
      <button
        className="cursor-pointer text-notoSansJP shadowYellow text-yellow p-2"
        onClick={nextMonth}
      >
        &gt;
      </button>
    </div>
  );
}

function CalendarWeekdays() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div
      className=" bg-black p-2 flex 
     text-yellow shadowYellow"
    >
      {weekdays.map((weekday) => (
        <div
          key={weekday}
          className="w-[17%]  flex cursor-auto pl-1  justify-center"
        >
          {weekday}
        </div>
      ))}
    </div>
  );
}

function CalendarDays({
  selectedDate,
  setSelectedDate,
  diaryData,
  setDayDiary,
  setTargetDiary,
}: Props) {
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
      setTargetDiary && setTargetDiary(diaryData[i]);
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
export default Diary;
