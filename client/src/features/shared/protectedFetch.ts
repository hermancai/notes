import refreshAccessToken from "./refreshAccessToken";

// Retries given fetch request if server returns 401
const protectedFetch = async <T>(
  origFetch: () => Promise<Response>
): Promise<Awaited<T>> => {
  const initialResponse = await origFetch();

  if (initialResponse.status === 200) return await initialResponse.json();

  if (initialResponse.status === 401) {
    const refreshRes = await refreshAccessToken();
    if (refreshRes.error) throw new Error(refreshRes.message);

    const retryResponse = await origFetch();
    const retryRes = await retryResponse.json();
    if (retryResponse.status !== 200) throw new Error(retryRes.message);

    return retryRes;
  }

  // Initial response was error but not 401
  const initialRes = await initialResponse.json();
  throw new Error(initialRes.message);
};

export default protectedFetch;
