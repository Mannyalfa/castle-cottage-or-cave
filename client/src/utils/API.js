
export const searchRentals = (city, stateId, bed, bath, rent_max) => {

  const rentCheck = (rent_max) ? `&price_max=${rent_max}` : "";
  const bedCheck = (bed) ? `&beds_min=${bed}` : "";
  const bathCheck = (bath) ? `&baths_min=${bath}` : "";

  return fetch(`https://us-real-estate.p.rapidapi.com/for-rent?city=${city}&state_code=${stateId}&limit=10${rentCheck}${bedCheck}${bathCheck}&rapidapi-key=a0097f7badmshb6eb43a4503cfd7p13d33cjsna3cca363e781`);
};

