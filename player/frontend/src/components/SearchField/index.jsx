'use client'
import { useDebounce } from "use-debounce";
import SearchIcon from "../../../public/assets/img/svg/SearchIcon";
import useSubCategoryStore from "@/store/useSubCategoryStore";
import Cross from "@/assets/images/Cross";
import { useEffect } from "react";

function SearchGames() {
  const { searchTerm, setSearchTerm, fetchGames, clearSearchedGames } = useSubCategoryStore();
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      clearSearchedGames();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    clearSearchedGames();
  };

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      fetchGames();
    }
  }, [debouncedSearchTerm]);

  return (
    <>
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none cursor-pointer">
        <SearchIcon />
      </div>
      <input
        type="search"
        id="default-search"
        className="block w-full p-4 max-md:py-2.5 ps-10 text-base text-white border-[3px] border-solid border-primary-100 rounded-lg bg-transparent focus:border-[3px] focus:border-green-500 focus-visible:outline-none placeholder:  placeholder:font-bold pr-48"
        placeholder="Search"
        onChange={handleSearchChange}
        value={searchTerm}
      />
      {searchTerm && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-56 max-md:pr-44 "
          onClick={handleClearSearch}
        >
          <Cross />
        </button>
      )}
    </>
  );
}

export default SearchGames;
