"use client";

import { useEffect } from "react";
import { useFilmStore } from "@/app/store/useFilmStore";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/app/types";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

interface HomeComponentProps {
  initialMovies: Movie[];
}

export default function HomeComponent({ initialMovies }: HomeComponentProps) {
  const { movies, isLoading, error, query, setMovies, setLoading, setError, setQuery } =
    useFilmStore();

  useEffect(() => {
    setMovies(initialMovies);
  }, [initialMovies, setMovies]);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput: query }),
      });

      if (!res.ok) throw new Error("Falha ao buscar recomendações");

      const data = (await res.json()) as { movies: Movie[] };
      setMovies(data.movies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2 items-center text-center">
        <h1 className="text-3xl font-bold">Cine Finder</h1>
        <p className="text-muted-foreground">Descreva o tipo de filme que você quer ver</p>
      </div>

      <div className="flex gap-2 max-w-xl mx-auto w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Ex: filmes de terror psicológico dos anos 90"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={isLoading}
        />
        <Button onClick={handleSearch} disabled={isLoading || !query.trim()}>
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
      </div>

      {error && (
        <p className="text-destructive text-sm text-center">{error}</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg bg-muted animate-pulse aspect-[2/3]"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  const year = movie.release_date?.slice(0, 4) ?? "—";
  const rating = movie.vote_average?.toFixed(1) ?? "—";

  return (
    <div className="flex flex-col gap-2 rounded-lg overflow-hidden border bg-card text-card-foreground">
      {movie.poster_path ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover"
        />
      ) : (
        <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center text-muted-foreground text-xs text-center px-2">
          Sem imagem
        </div>
      )}
      <div className="px-2 pb-3 flex flex-col gap-1">
        <p className="text-sm font-medium leading-tight line-clamp-2">{movie.title}</p>
        <p className="text-xs text-muted-foreground">
          {year} · ⭐ {rating}
        </p>
      </div>
    </div>
  );
}
