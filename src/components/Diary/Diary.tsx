import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import firebase from "../../utils/firebase";
import { DiaryType } from "../../utils/type";

import CalendarDays from "./CalendarDays";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarWeekdays } from "./CalendarWeekdays";
import { Post } from "./Post";

function Diary() {
  const { userUID } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [diaryData, setDiaryData] = useState<DiaryType[] | []>([]);
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
    async function getUserDiary() {
      const docSnap = await firebase.getUserDiary(userUID);
      setDiaryData(docSnap as DiaryType[]);
    }
    getUserDiary();
  }, [targetDiary]);

  return (
    <div className="w-[100%] rounded-xl font-NT bg-opacity-60">
      <CalendarHeader
        selectedDate={selectedDate}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />
      <CalendarWeekdays />
      <CalendarDays
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        diaryData={diaryData}
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

export default Diary;
