import { ActionEnum } from "../../../utils/type";

export function reducer(_, action: { type: ActionEnum }): ActionEnum {
  switch (action.type) {
    case ActionEnum.Preview: {
      return ActionEnum.Preview;
    }
    case ActionEnum.Start: {
      return ActionEnum.Start;
    }
    case ActionEnum.End: {
      return ActionEnum.End;
    }
  }
  throw Error(`Unknown action: ${action.type}`);
}
