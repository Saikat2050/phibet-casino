import { getCasinoGamesAction, getSubCategories } from '@/actions';
import ProviderGameListing from '@/components/Providersgame';

export async function fetchInitialGamesForProvider(id) {
  try {
    const params = { page: 1, limit: 24, masterCasinoProviderId: id };
    const result = await getCasinoGamesAction(params);
    return result;
  } catch (error) {
    console.log(error, "Error fetching initial games");
    return {};
  }
}

const page = async ({ params, searchParams }) => {
  const id = searchParams.id;
  const name= searchParams.name
  const result = await fetchInitialGamesForProvider(id);

  return <ProviderGameListing params={params} result={result || {}} name={name} id={id}/>;
};

export default page;
