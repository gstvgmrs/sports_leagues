import axios from 'axios'

const API_URL = 'https://www.thesportsdb.com/api/v1/json/3'

export const leaguesService = {
  async fetchLeagues() {
    const response = await axios.get(`${API_URL}/all_leagues.php`)
    return response.data.leagues
  },

  async fetchLeagueBadge(idLeague: string) {
    const response = await axios.get(`${API_URL}/search_all_seasons.php?badge=1&id=${idLeague}`)
    const seasons = response.data.seasons
    if (seasons && seasons.length > 0) {
      const lastSeason = seasons[seasons.length - 1]
      return lastSeason.strBadge
    }
    return null
  },
}
