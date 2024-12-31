// Hämta API-basadressen från miljövariabler via Vite och exportera för återanvändning i applikationen.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default API_BASE_URL;
