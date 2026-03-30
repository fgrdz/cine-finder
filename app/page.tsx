import { fetchPopularMovies } from "@/app/lib/tmdb";
import HomeComponent from "./components/homeComponent/home";

export default async function Home() {
  const movies = await fetchPopularMovies();
  return (
    <main className="flex flex-1 flex-col">
      <HomeComponent initialMovies={movies} />
    </main>
  );
}
