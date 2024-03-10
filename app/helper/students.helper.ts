export function getStudentsSearchParams(urlString: string) {
  const url = new URL(urlString);
  const start = url.searchParams.get('start') ?? 0;
  const end = url.searchParams.get('end') ?? 15;
  const name = url.searchParams.get('name') ?? '';

  return {
    start,
    end,
    name,
  };
}
