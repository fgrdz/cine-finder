import { cacheLife } from "next/cache";
import type { Movie, TMDBListResponse } from "@/app/types";

const BASE_URL = "https://api.themoviedb.org/3";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    accept: "application/json",
  };
}

async function fetchPage(path: string, page: number): Promise<Movie[]> {
  const url = `${BASE_URL}${path}&page=${page}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  const data = (await res.json()) as TMDBListResponse<Movie>;
  return data.results;
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  "use cache";
  cacheLife("days");

  const path = "/movie/popular?language=pt-BR";
  const [page1, page2] = await Promise.all([fetchPage(path, 1), fetchPage(path, 2)]);
  return [...page1, ...page2];
}

export async function fetchDiscoverMovies(): Promise<Movie[]> {
  const path = "/discover/movie?sort_by=popularity.desc&language=pt-BR";
  const [page1, page2] = await Promise.all([fetchPage(path, 1), fetchPage(path, 2)]);
  return [...page1, ...page2];
}
