const COUNTRIES_API_URL = "https://api.restcountries.com/countries/v5";
const PAGE_SIZE = 100;

export async function getCountries() {
  const apiKey = process.env.RESTCOUNTRIES_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESTCOUNTRIES_API_KEY environment variable");
  }

  const countries = [];
  let offset = 0;
  let more = true;

  while (more) {
    const response = await fetch(
      `${COUNTRIES_API_URL}?response_fields=names.common,codes.alpha_2&limit=${PAGE_SIZE}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch countries: ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();

    countries.push(
      ...payload.data.objects.map((country) => ({
        code: country.codes.alpha_2,
        name: country.names.common,
      }))
    );

    more = payload.data.meta.more;
    offset += PAGE_SIZE;
  }

  return countries.sort((a, b) => a.name.localeCompare(b.name));
}