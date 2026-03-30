import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";
import { fetchDiscoverMovies } from "@/app/lib/tmdb";

const bodySchema = z.object({
  userInput: z.string().min(3).max(500),
});

const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Entrada inválida" }, { status: 400 });
  }

  const { userInput } = parsed.data;
  const movies = await fetchDiscoverMovies();

  const movieList = movies
    .map(
      (m) =>
        `id:${m.id} | "${m.title}" | ${m.release_date.slice(0, 4)} | genres:${m.genre_ids.join(",")} | ${m.overview.slice(0, 120)}`
    )
    .join("\n");

  const { object } = await generateObject({
    model: bedrock("anthropic.claude-3-haiku-20240307-v1:0"),
    schema: z.object({
      movieIds: z.array(z.number()).max(15),
    }),
    prompt: `Você é um especialista em cinema. O usuário quer: "${userInput}".

Abaixo está uma lista de filmes com id, título, ano, gêneros e sinopse:
${movieList}

Retorne os IDs dos filmes (campo movieIds) que melhor correspondem ao pedido do usuário. Máximo 15 filmes.`,
  });

  const ids = new Set(object.movieIds);
  const result = movies.filter((m) => ids.has(m.id));

  return Response.json({ movies: result });
}
