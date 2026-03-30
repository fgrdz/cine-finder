import { create } from "zustand";
import type { Movie } from "@/app/types";

interface FilmStore {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  query: string;
  setMovies: (movies: Movie[]) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setQuery: (q: string) => void;
}

export const useFilmStore = create<FilmStore>((set) => ({
  movies: [],
  isLoading: false,
  error: null,
  query: "",
  setMovies: (movies) => set({ movies }),
  setLoading: (v) => set({ isLoading: v }),
  setError: (msg) => set({ error: msg }),
  setQuery: (q) => set({ query: q }),
}));
