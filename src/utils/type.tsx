import { DocumentData, Timestamp } from "firebase/firestore";

export type Spread =
  | number
  | {
      order: number;
      disabled?: boolean;
      value: string;
      name: string;
      card: number;
      reverse: boolean;
    };
export type Comment = {
  comment: string;
  user: string;
  userName: string;
  userImage: string;
};








export interface SpreadItem {
  reverse: boolean;
  disabled: boolean;
  value: string;
  order: number;
  card: number;
}

export interface TarotData {
  description: string;
  title: string;
  like: string[];
  userUID: string;
  spread: SpreadItem[];
  comment: Comment[];
  image: string;
  spreadId: string;
  secret: boolean;
  content: string;
  askGpt: string;
  time: {
    seconds: number;
    nanoseconds: number;
  };
  docId: string;
  question: string;
  user: string;
  userImg: string;
  userName: string;
  addComment: false;
  seeMore: false;
}
export interface VisitedUser {
  name?: string;
  image?: string;
  sign?: string;
  favorite?: [];
  followers?: string[];
  following?: string[];
  diary?: DocumentData[];
  spread?: DocumentData[];
  userUID?: string;
  like?: string[];
  docId?: string;
  content?: string;
  seeMore?: boolean;
}
//spread
export interface SpreadData {
  author?: string;
  userUID: string;
  title: string;
  image: string;
  spread: (
    | number
    | {
        order: number;
        disabled?: boolean;
        value: string;
        name: string;
        card: number;
        reverse: boolean;
      }
  )[];
  description?: string;
  spreadId: string;
  name?: string;
  time?: Timestamp;
  comment?: { comment: string; user: string; userImg: string }[];
  like?: string[];
  docId?: string;
  content?: string;
  seeMore?: boolean;
}
export interface DraggableProps {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  spreadData: SpreadData | undefined;
  setSpreadData: React.Dispatch<React.SetStateAction<SpreadData | undefined>>;
}

export interface DesignSpreadData {
  image: string;
  title: string;
  spread:
    | number[]
    | {
        disabled: boolean;
        value: string;
        order: number;
        name: string;
        card: number;
        reverse: boolean;
      }[];
  userUID?: string;
  description: string;
  spreadId: string;
  question?: string;
  secret: boolean;
}
export type SpreadPreviewProps = {
  type: string;
  spread: SpreadData;
  index: number;
  key?: number;
  page?: number;
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
