import { collection, doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import db from "./Firebasedb";
function AddDoc() {
  async function abc() {
    const diaryRef = collection(
      db,
      "user",
      "FzR7iLM5E5MLHV6ROgDMYE8SsQ52",
      "diary",
      "FzR7iLM5E5MLHV6ROgDMYE8SsQ52"
    );
    await setDoc(doc(diaryRef, "SF"), {
      title: "Daily Tarot",
      card: 30,
      reverse: false,
      secret: false,
      time: { second: 858000000, nanosecond: 1680527740 },
    });

    await setDoc(doc(diaryRef, "SF"), {
      title: "Daily Tarot",
      card: 10,
      reverse: false,
      secret: false,
      time: { second: 858000000, nanosecond: 1650627740 },
    });
  }
  useEffect(() => {
    abc();
  }, []);
  return;
}
export default AddDoc;
