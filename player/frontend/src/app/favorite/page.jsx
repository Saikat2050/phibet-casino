import { getFavoriteGames } from '@/actions';
import FavouriteGamesShow from '@/components/FavouriteGames/FavouriteGamesShow';


import React from 'react'


export async function fetchInitialGames() {
    try {
        const params = { page: 1, limit: 24};
        const result = await getFavoriteGames(params);
        return result;

    } catch (error) {
        console.error('Failed to fetch initial games:', error);
        return {};
    }
}

const GameFavorite = async () => {
    const result = await fetchInitialGames();
    return <FavouriteGamesShow params="Favourite Games" result={result || {}} />;
}

export default GameFavorite