import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "store";

// This isn't necessary but for hooks that will be used very often, its better
// to create typed versions of them so we dont need to specify type every time
// we use the hook (ex. For useSelector, state:RootState)

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
