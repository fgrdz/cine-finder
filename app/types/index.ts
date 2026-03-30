export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBListResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}
