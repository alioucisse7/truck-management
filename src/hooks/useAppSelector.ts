
import { useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState } from '../store/store';
import { useAppDispatch } from './useAppDispatch';

// Use throughout app instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export the dispatch hook for convenience
export { useAppDispatch };
