import { GifItem } from '../store/useGifStore';
import { Drawing } from './drawing';
import { Note } from './notes';

export type Board = {
  id: string;
  title: string;
  notes: Note[];
  drawings: Drawing[];
  gifs: GifItem[];
};
