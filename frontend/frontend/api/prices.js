const SHEET_URL = "https://docs.google.com/spreadsheets/d/1TGDDLLQqB6NRPpEWyXlYVigGMbU0w7kMeRyp2coYY38/gviz/tq?tqx=out:csv&sheet=%C3%81rlista";

module.exports = async function pricesHandler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sheetResponse = await fetch(SHEET_URL, {
      headers: { "User-Agent": "Anita-Art-of-Beauty-Price-Sync/1.0" },
    });

    if (!sheetResponse.ok) {
      throw new Error(`Google Sheets HTTP ${sheetResponse.status}`);
    }

    const csv = await sheetResponse.text();
    response.setHeader("Content-Type", "text/csv; charset=utf-8");
    response.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return response.status(200).send(csv);
  } catch (error) {
    console.error("A Google-árlista nem érhető el.", error);
    return response.status(502).json({ error: "A friss árlista átmenetileg nem érhető el." });
  }
};
