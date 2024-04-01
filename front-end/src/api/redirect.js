const fetch = require('node-fetch');

export default async (req, res) => {
  const { apiUrl } = req.query;

  if (!apiUrl) {
    return res.status(400).json({ error: 'API URL is missing' });
  }
   console.log("apiUrl",apiUrl)
  try {
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();
    console.log("apires", apiData)
    res.json(apiData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};