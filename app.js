const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';

  // Get client IP address
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Use an IP geolocation API to get location
  const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
  const location = locationResponse.data.city || 'your city';

  // Use a weather API to get the current temperature
  const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=182ab95d87d5c82a1006ca1a31da03c1`);
  const temperature = weatherResponse.data.main.temp;

  res.json({
    client_ip: clientIp,
    location: location,
    greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
