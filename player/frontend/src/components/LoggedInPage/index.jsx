'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import BannerSection from '@/components/BannerSection';
import CategorySlider from '@/components/CategorySlider';
import { getBanners, getProviderListing, getSubCategories } from '@/actions';
import useUserStore from '@/store/useUserStore';
import Loading from '@/utils/loading';

const GamesSection = dynamic(() => import('@/components/GamesSection'), {
  loading: () => <div className="flex flex-col items-center justify-center min-h-[300px]">Loading...</div>,
});
const SearchGames = dynamic(() => import('@/components/SearchField'), {
  loading: () => <div className="flex flex-col items-center justify-center min-h-[300px]">Loading...</div>,
});
const CategorySelect = dynamic(() => import('@/components/CategorySelect'), {
  loading: () => <div className="flex flex-col items-center justify-center min-h-[300px]">Loading...</div>,
});

const LoggedInPage = () => {
  const { user, isAuthenticated } = useUserStore();
  const [subCategories, setSubCategories] = useState([]);
  const [bannersData, setBannersData] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [subCats, banners, providers] = await Promise.all([
          getSubCategories(),
          getBanners(),
          getProviderListing(),
        ]);
        setSubCategories(subCats || []);
        setBannersData(banners || []);
        setProviderOptions([
          { value: null, label: 'All' },
          ...(Array.isArray(providers)
            ? providers.filter((p) => p.isActive).map((p) => ({
                value: p.masterCasinoProviderId,
                label: p.name,
              }))
            : []),
        ]);
      } catch (e) {
        setSubCategories([]);
        setBannersData([]);
        setProviderOptions([{ value: null, label: 'All' }]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const promotionalBanner = useMemo(
    () =>
      Array.isArray(bannersData)
        ? bannersData.filter((banner) => banner.pageName === 'promotionPage')
        : [],
    [bannersData]
  );
  const lobbySlider = useMemo(
    () =>
      Array.isArray(bannersData)
        ? bannersData.filter((banner) => banner.pageName === 'lobbySlider')
        : [],
    [bannersData]
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <BannerSection promotionalBanner={[]} lobbySlider={[]} />
        {/* Optionally, show a login prompt or minimal lobby here */}
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col">
      <BannerSection promotionalBanner={promotionalBanner} lobbySlider={lobbySlider} />
      <CategorySlider subCategories={subCategories} className="mt-5 sm:mt-6 mb-7" />
      <div className="w">
        <form className="w-full mx-auto">
          <div className="relative">
            <SearchGames />
            <CategorySelect
              providers={providerOptions}
              className="absolute z-[21] right-2 max-md:right-2 top-1/2 -translate-y-1/2 "
            />
          </div>
        </form>
      </div>
      <div className="py-4">
        <GamesSection subCategories={subCategories} />
      </div>
    </div>
  );
};

export default LoggedInPage;
