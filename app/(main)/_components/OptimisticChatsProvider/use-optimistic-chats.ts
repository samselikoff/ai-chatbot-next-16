import { use } from "react";
import { Context } from ".";

export function useOptimisticChats() {
  return use(Context);
}
