import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || query.length < 2) return NextResponse.json([]);

  try {
    const url = `https://kpop.fandom.com/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=8&prop=pageimages&piprop=thumbnail&pithumbsize=300&format=json&origin=*`;

    const res = await fetch(url, {
      headers: { "User-Agent": "BiasingApp/1.0 (contact@biasing.com)" },
    });
    const data = await res.json();

    const pages = data?.query?.pages;

    if (!pages) {
      return NextResponse.json([]);
    }

    const filtered = Object.values(pages).map((page: any) => {
      const name = page.title;
      const image =
        page.thumbnail?.source ||
        `https://images.wikia.com/kpop/images/c/cb/Placeholder.png`;

      return {
        name,
        image,
      };
    });

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error obteniendo imágenes de Fandom:", error);
    return NextResponse.json(
      { error: "Error al conectar con Fandom" },
      { status: 500 },
    );
  }
}
