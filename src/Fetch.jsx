import { useState, useEffect } from "react";
import React from "react"

const PokemonComponente = () => {
    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    const [ offset, setOffset] = useState(0);
    const [ limit, setLimit ] = useState(10);
    
    useEffect(() => {
        const pokemonFetch = async () => {

            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
                if (!response.ok) {
                    throw new Error("Error en la Petición");
                }
                const data = await response.json();
    
                const detallesFetch = async (url) => {
                    const resp = await fetch(url);
                    if (!resp.ok) {
                        throw new Error("Error al obtener detalles del Pokémon");
                    }
                    return await resp.json();
                };
                const detallesPokemon = await Promise.all(
                    data.results.map((pokemon) => detallesFetch(pokemon.url))
                );
    
                setData(detallesPokemon);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
    
        pokemonFetch();
    }, [offset, limit]);

    if(loading){
        return(<p>Cargando Pokemones</p>)
    }
    if(error){
        return(<p>Error en la Petición</p>)
    }
    if (!data) return null;

    const prev = () => {
        if(offset >= limit){
            setOffset(offset - limit)
        }
    }

    const next = () => {
        setOffset(offset + limit)
    }

    return(
        <div>
            <h1>Pokedex</h1>
            <button onClick={prev}>Anterior</button>
            <button onClick={next}>Siguiente</button>
            {data.map((pokemon) => <p>{pokemon.name.toUpperCase()}</p>)}
        </div>  
    )
}

export default PokemonComponente