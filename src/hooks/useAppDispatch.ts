
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';

// Use throughout app instead of plain `useDispatch`
export const useAppDispatch = () => useDispatch<AppDispatch>();
