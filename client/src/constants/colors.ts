// Refined stationery paper color palette with static classes for complete dark mode support.

export interface NoteColor {
  id: string;
  name: string;
  swatch: string;
  dotColor: string;
  classes: string;
}

export const NOTE_COLORS: NoteColor[] = [
  { id: 'paper', name: 'Alabaster', swatch: '#FAF8F5', dotColor: '#D3CBC1', classes: 'bg-[#FAF8F5] dark:bg-[#1E1D1C] border-stone-300/80 dark:border-stone-800 text-stone-900 dark:text-stone-50' },
  { id: 'sage', name: 'Matcha', swatch: '#EEF4EE', dotColor: '#93B497', classes: 'bg-[#EEF4EE] dark:bg-[#1A231C] border-emerald-300/70 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-50' },
  { id: 'peach', name: 'Apricot', swatch: '#FCF2EC', dotColor: '#D89E82', classes: 'bg-[#FCF2EC] dark:bg-[#261C17] border-amber-300/70 dark:border-amber-900/60 text-amber-950 dark:text-amber-50' },
  { id: 'lilac', name: 'Wisteria', swatch: '#F5F0F8', dotColor: '#B6A0C7', classes: 'bg-[#F5F0F8] dark:bg-[#221B27] border-purple-300/70 dark:border-purple-900/60 text-purple-950 dark:text-purple-50' },
  { id: 'sky', name: 'Mist Blue', swatch: '#EEF4F9', dotColor: '#96B9D0', classes: 'bg-[#EEF4F9] dark:bg-[#182128] border-sky-300/70 dark:border-sky-900/60 text-sky-950 dark:text-sky-50' },
  { id: 'butter', name: 'Honey Oat', swatch: '#FBF7EA', dotColor: '#D7BC75', classes: 'bg-[#FBF7EA] dark:bg-[#252115] border-yellow-300/70 dark:border-yellow-900/60 text-yellow-950 dark:text-yellow-50' },
  { id: 'rose', name: 'Rose Dust', swatch: '#F9EDF1', dotColor: '#CE93A7', classes: 'bg-[#F9EDF1] dark:bg-[#26181F] border-rose-300/70 dark:border-rose-900/60 text-rose-950 dark:text-rose-50' },
];

export const DEFAULT_NOTE_COLOR = 'paper';

export const getColorConfig = (colorId?: string): NoteColor => {
  return NOTE_COLORS.find((c) => c.id === colorId) || NOTE_COLORS[0];
};
