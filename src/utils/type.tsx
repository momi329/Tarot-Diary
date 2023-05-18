import { Timestamp } from "firebase/firestore";
/* eslint-disable */
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

export type Comment = {
  comment: string;
  user: string;
  userName: string;
  userImg: string;
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
    userImg: string;
  }[];
  askGpt: string;
  docId: string;
  question: string;
  title: string;
  content: string;
  time: Timestamp;
  like: string[];
  userUID: string;
  spread: (number | SpreadItem)[];
  user: string;
  userImg: string;
  userName: string;
  seeMore?: boolean;
};
export type FriendsPostsType = {
  content?: string;
  image: string;
  spread: (number | SpreadItem)[];
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
  spread: (number | SpreadItem)[];
  description: string;
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
  spread: (number | SpreadItem)[];
  userUID?: string;
  description: string;
  spreadId: string;
  question?: string;
  secret?: boolean;
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
export type GalleryProps = {
  data: DiaryType[] | FriendsPostsType[] | null | SpreadData[];
  page: PageEnum;
};

export type Day = {
  title: string;
  card: number;
  reverse: boolean;
  secret: boolean;
  time: Timestamp;
  content: string;
};
export type TarotCardType = {
  name: string;
  number: string;
  arcana: string;
  suit: string;
  img: string;
  fortune_telling: string[];
  keywords: string[];
  meanings: {
    light: string[];
    shadow: string[];
  };
  Archetype?: string;
  Hebrew_Alphabet?: string;
  Numerology?: string;
  Elemental?: string;
  Mythical_Spiritual?: string;
  Questions_to_Ask?: string[];
  Astrology?: string;
  Affirmation?: string;
};
export type UserSpreadType = {
  time: Timestamp;
  image: string;
  spreadId: string;
  userUID: string;
  comment: Comment[];
  spread: (SpreadItem | number)[];
  like: string[];
  description: string;
  title: string;
};
export type ProfileType =
  | {
      name: string;
      image: string;
      sign: string;
      followers: string[];
      following: string[];
      favorite: [];
    }
  | undefined;
