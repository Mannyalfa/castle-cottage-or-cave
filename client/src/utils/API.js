// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter

export const searchRentals = (city, stateId) => {
  return fetch(`https://us-real-estate.p.rapidapi.com/for-rent?city=${city}&state_code=${stateId}&rapidapi-key=a0097f7badmshb6eb43a4503cfd7p13d33cjsna3cca363e781`);
};
