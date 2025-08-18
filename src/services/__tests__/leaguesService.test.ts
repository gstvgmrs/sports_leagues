import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { Mock } from 'vitest'
import axios from 'axios'
import { leaguesService } from '@/services/leaguesService'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}))

const mockedGet = axios.get as Mock

const mockLeaguesResponse = {
  data: {
    leagues: [
      {
        idLeague: '1',
        strLeague: 'Premier League',
        strLeagueAlternate: 'EPL',
        strSport: 'Soccer',
      },
      {
        idLeague: '2',
        strLeague: 'NBA',
        strLeagueAlternate: 'National Basketball Association',
        strSport: 'Basketball',
      },
    ],
  },
}

const mockSeasonsResponse = {
  data: {
    seasons: [
      {
        idSeason: '1',
        strSeason: '2022-2023',
        strBadge: 'https://example.com/badge1.png',
      },
      {
        idSeason: '2',
        strSeason: '2023-2024',
        strBadge: 'https://example.com/badge2.png',
      },
    ],
  },
}

describe('LeaguesService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchLeagues', () => {
    it('should fetch leagues successfully', async () => {
      mockedGet.mockResolvedValue(mockLeaguesResponse)

      const result = await leaguesService.fetchLeagues()

      expect(mockedGet).toHaveBeenCalledWith(
        'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php',
      )
      expect(result).toEqual(mockLeaguesResponse.data.leagues)
    })

    it('should throw error when API call fails', async () => {
      const errorMessage = 'Network Error'
      mockedGet.mockRejectedValue(new Error(errorMessage))

      await expect(leaguesService.fetchLeagues()).rejects.toThrow(errorMessage)
      expect(mockedGet).toHaveBeenCalledWith(
        'https://www.thesportsdb.com/api/v1/json/3/all_leagues.php',
      )
    })

    it('should handle empty response', async () => {
      const emptyResponse = { data: { leagues: [] } }
      mockedGet.mockResolvedValue(emptyResponse)

      const result = await leaguesService.fetchLeagues()

      expect(result).toEqual([])
    })

    it('should handle null leagues in response', async () => {
      const nullResponse = { data: { leagues: null } }
      mockedGet.mockResolvedValue(nullResponse)

      const result = await leaguesService.fetchLeagues()

      expect(result).toBeNull()
    })
  })

  describe('fetchLeagueBadge', () => {
    it('should fetch badge from last season successfully', async () => {
      mockedGet.mockResolvedValue(mockSeasonsResponse)

      const result = await leaguesService.fetchLeagueBadge('123')

      expect(mockedGet).toHaveBeenCalledWith(
        'https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=123',
      )
      expect(result).toBe('https://example.com/badge2.png') // Last season badge
    })

    it('should return null when no seasons available', async () => {
      const noSeasonsResponse = { data: { seasons: [] } }
      mockedGet.mockResolvedValue(noSeasonsResponse)

      const result = await leaguesService.fetchLeagueBadge('123')

      expect(result).toBeNull()
    })

    it('should return null when seasons is null', async () => {
      const nullSeasonsResponse = { data: { seasons: null } }
      mockedGet.mockResolvedValue(nullSeasonsResponse)

      const result = await leaguesService.fetchLeagueBadge('123')

      expect(result).toBeNull()
    })

    it('should return null when seasons is undefined', async () => {
      const undefinedSeasonsResponse = { data: {} }
      mockedGet.mockResolvedValue(undefinedSeasonsResponse)

      const result = await leaguesService.fetchLeagueBadge('123')

      expect(result).toBeNull()
    })

    it('should handle single season correctly', async () => {
      const singleSeasonResponse = {
        data: {
          seasons: [
            {
              idSeason: '1',
              strSeason: '2023-2024',
              strBadge: 'https://example.com/single-badge.png',
            },
          ],
        },
      }
      mockedGet.mockResolvedValue(singleSeasonResponse)

      const result = await leaguesService.fetchLeagueBadge('456')

      expect(result).toBe('https://example.com/single-badge.png')
    })

    it('should throw error when API call fails', async () => {
      const errorMessage = 'Badge fetch failed'
      mockedGet.mockRejectedValue(new Error(errorMessage))

      await expect(leaguesService.fetchLeagueBadge('123')).rejects.toThrow(errorMessage)
      expect(mockedGet).toHaveBeenCalledWith(
        'https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=123',
      )
    })

    it('should handle seasons without badges', async () => {
      const noBadgeResponse = {
        data: {
          seasons: [
            {
              idSeason: '1',
              strSeason: '2023-2024',
            },
          ],
        },
      }
      mockedGet.mockResolvedValue(noBadgeResponse)

      const result = await leaguesService.fetchLeagueBadge('789')

      expect(result).toBeUndefined()
    })

    it('should use correct league ID in API call', async () => {
      mockedGet.mockResolvedValue({ data: { seasons: [] } })
      const testLeagueId = 'test-league-id-456'

      await leaguesService.fetchLeagueBadge(testLeagueId)

      expect(mockedGet).toHaveBeenCalledWith(
        `https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=${testLeagueId}`,
      )
    })
  })
})
