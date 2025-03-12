import { useState, useEffect } from "react";
import React from "react"
import "../src/Fetch.css"

const PokemonComponente = () => {
    const [ data, setData ] = useState(null)
    const [ dataDuplicada, setDataDuplicada ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    const [ offset, setOffset] = useState(0);
    const [ limit, setLimit ] = useState(10);

    const [ filtro, setFiltro ] = useState([])
    const [ buscador, setBuscador ] = useState("")
    
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
    
                setDataDuplicada(detallesPokemon);
                setData(detallesPokemon);
                setFiltro(detallesPokemon);

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

    const handleBuscador = (event) => {
        const valor = event.target.value.toLowerCase();
        setBuscador(valor);
    
        if (valor === "") {
            setFiltro(data);
        } else {
            const resultado = data.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(valor)
            );
            setFiltro(resultado);
        }
    };

    const handleFilter = (e) => {
        e.preventDefault()
        console.log("Data", data);
        console.log("Buscador", buscador);
        
        const resultado = data.filter((pokemon) => pokemon.name.toLowerCase().includes(filtro))
        setFiltro(resultado)
        console.log("Resultado Guardado", resultado);
        
    }

    return(
        <>
            <form className="form" onSubmit={handleFilter}>
                <input value={buscador} onChange={handleBuscador} placeholder="Buscador Pokemon" type="text"></input>
                <button type="submit">Buscar</button>
            </form>

            <h2>Buscá Tu Pokemon Favorito</h2>
            <div className="botones">
                <button onClick={prev}>Anterior</button>
                <button onClick={next}>Siguiente</button>
            </div>    
            
            <div className="pokemonContenedor">
                {filtro.map((pokemon) => (
                    <div>
                        <p>{pokemon.name.toUpperCase()}</p>
                        <img className="pokemonImg" src={pokemon.sprites.front_default} alt={pokemon.name}></img>
                        <p>{pokemon.types.map(type => type.type.name).join(", ").toUpperCase()}</p>
                        <p>Altura: {pokemon.height} Dm</p>
                        <p>Peso: {pokemon.weight} Hg</p>
                    </div>
                    ))}
            </div>
        </>
    )
}

export default PokemonComponente