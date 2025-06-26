import { GifItem } from '../store/useGifStore';
import { Drawing } from './drawing';
import { Note } from './notes';
import { User } from './user';

export type Board = {
  id: string;
  title: string;
  cardColorTheme: string;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
  drawings: Drawing[];
  gifs: GifItem[];
  users: User[];
};
