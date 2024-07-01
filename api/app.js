// const express = require('express');
// const axios = require('axios');
// const app = express();
// const PORT = process.env.PORT || 8080;

// app.get('/api/hello', async (req, res) => {
//   const visitorName = req.query.visitor_name || 'Guest';

//   // Get client IP address
//   const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//   // Use an IP geolocation API to get location
//   const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
//   const location = locationResponse.data.city || 'your city';

//   // Use a weather API to get the current temperature
//   const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=182ab95d87d5c82a1006ca1a31da03c1`);
//   const temperature = weatherResponse.data.main.temp;

//   res.json({
//     client_ip: clientIp,
//     location: location,
//     greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });





const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';

  // Get client IP address
  const clientIp = req.headers['x-real-ip'] || req.socket.remoteAddress;
  console.log(clientIp);

  try {
    // Use an IP geolocation API to get location
    const locationResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
    if (locationResponse.data.status !== 'success') {
      throw new Error('Location not found');
    }

    const location = locationResponse.data.city || 'your city';

    // Use a weather API to get the current temperature
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: location,
        units: 'metric',
        appid: '182ab95d87d5c82a1006ca1a31da03c1'
      }
    });

    if (weatherResponse.data.cod !== 200) {
      throw new Error('Weather data not found');
    }

    const temperature = weatherResponse.data.main.temp;

    res.json({
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
    });
  } catch (error) {
    console.error(error);

    res.json({
      client_ip: clientIp,
      location: 'unknown',
      greeting: `Hello, ${visitorName}!, the temperature data is not available`
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

