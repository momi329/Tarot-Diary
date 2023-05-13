import { Timestamp } from "firebase/firestore";
export type User = {
  name: string;
  image: string;
  sign: string;
  email: string;
  followers: string[];
  following: string[];
  favorite: [];
  userUID: string;
};
export type Spread = number[] | SpreadItem[];
export type Comment = {
  comment: string;
  user: string;
  userName: string;
  userImage: string;
};
export type DiaryType = {
  description: string;
  secret: boolean;
  image: string;
  spreadId: string;
  comment: {
    comment: string;
    user: string;
    userName: string;
    userImage: string;
  }[];
  askGpt: string;
  docId: string;
  question: string;
  title: string;
  content: string;
  time: Timestamp;
  like: string[];
  userUID: string;
  spread: Spread[];
  user: string;
  userImg: string;
  userName: string;
  seeMore?: boolean;
};
export type FriendsPostsType = {
  content?: string;
  image: string;
  spread: Spread[];
  description: string;
  secret?: boolean;
  time: Timestamp;
  askGpt: string;
  title: string;
  like: string[];
  docId?: string;
  question: string;
  spreadId: string;
  userUID: string;
  user: string;
  userImg: string;
  userName: string;
  comment?: Comment[];
  seeMore?: boolean;
};
export type UseGetDesignHooks = {
  spreadData: SpreadData | null;
  setSpreadData: React.Dispatch<React.SetStateAction<SpreadData | null>>;
  divinedData: DesignSpreadData;
  setDivinedData: React.Dispatch<React.SetStateAction<DesignSpreadData>>;
  getDesign: () => Promise<void>;
  pickCard: Number[];
  setPickCard: React.Dispatch<React.SetStateAction<Number[]>>;
};

export type SpreadItem = {
  reverse?: boolean;
  disabled: boolean;
  value: string;
  order: number;
  card?: number;
  name?: string;
};
export enum PageEnum {
  DiaryCalendar = "diaryCalendar",
  DiaryPost = "diaryPost",
  Explore = "explore",
  EditProfile = "editProfile",
  Design = "design",
}
export type SpreadData = {
  author?: string;
  userUID: string;
  title: string;
  image: string;
  spread: Spread;
  description?: string;
  spreadId: string;
  name?: string;
  time?: Timestamp;
  comment?: { comment: string; user: string; userImg: string }[];
  like?: string[];
  docId?: string;
  content?: string;
  seeMore?: boolean;
};
export type DraggableProps = {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  spreadData: SpreadData | undefined;
  setSpreadData: React.Dispatch<React.SetStateAction<SpreadData | undefined>>;
};

export type DesignSpreadData = {
  image: string;
  title: string;
  spread: number[] | SpreadItem[];
  userUID?: string;
  description: string;
  spreadId: string;
  question?: string;
  secret: boolean;
};

export type FriendsData = {
  followers: friends[];
  following: friends[];
};
type friends = {
  name: string;
  sign: string;
  image: string;
  uid: string;
};

export enum ActionEnum {
  Preview = "preview",
  Start = "start",
  End = "end",
}
