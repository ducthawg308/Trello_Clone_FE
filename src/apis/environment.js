export const API_ROOT =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8017'
    : 'https://trello-clone-be-07k4.onrender.com'