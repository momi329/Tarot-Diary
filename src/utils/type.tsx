import { DocumentData, Timestamp } from "firebase/firestore";

//profile
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
}
//spread
export interface SpreadData {
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
//gpt
export interface Message {
  value: string;
  name: string;
  order: number;
  disabled: boolean;
  card: number;
  reverse: boolean;
}
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
export type comment = {
  userName: string;
  userImage: string;
  comment: string;
  user: string;
};
