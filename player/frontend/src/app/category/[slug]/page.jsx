  import { getSubCategories } from '@/actions';
  import SubCategoryGame from '@/components/SubCategoryGame';
  
  export async function fetchInitialGamesForCategory(id) {
    try {
      const params = { page: 1, limit: 24, subCategoryId: id };
      const result = await getSubCategories(params);
      return result;
    } catch (error) {
      console.log(error, "Error fetching initial games");
      return {};
    }
  }
  
  const page = async ({ params, searchParams }) => {
    const id = searchParams.id;
    const result = await fetchInitialGamesForCategory(id);
    return <SubCategoryGame params={params} result={result[0] || {}} />;
  };
  
  export default page;
  