import create from 'zustand'
import axios from "axios";

export const useStore = create((set) => ({
    pokemons: [],
    movie: {},
    loading: false,
    getPokemons: async () => {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon')
        set({ pokemons: await response.data.results })
    },
    getMovieDetail: async(movieTitle) => {
        set({ loading: true })
        const response = await axios.get(`http://www.omdbapi.com/?apikey=da979bab&t=${movieTitle}`)
        set({ loading: false, movie: await response.data})
    }
}))