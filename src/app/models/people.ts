export interface People {
    name: string,
    height: number,
    mass: number,
    hair_color: string,
    skin_color: string,
    eye_color: string,
    birth_year: string,
    gender: string,
    homeworld: string,
    films: string[],
    species: [],
    vehicles: [],
    starships: [],
    created: string,
    edited: string,
    url: string
}
export interface filterOptions {
    film: any[],
    species: any[],
    vehicle: any[],
    starShip: any[],
    birthYear: any[]
}