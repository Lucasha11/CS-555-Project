import {Router} from 'express';
const router = Router();
import { weatherData } from '../data/index.js';




router
  .route('/forecast')
  .get(async (req, res) => {
    try {
      if (!req.body.location || typeof req.body.location !== 'string'){
        throw new Error('Location must be a valid string')
      }
      const weatherList = await weatherData.getDailyForecast(req.body.location);
      return res.json(weatherList);
      } catch (e) {
      console.log(e);
      return res.status(500).send(e);
      }
    });

router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const data = await weatherData.getCurrentWeather(lat, lon);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/geocode', async (req, res) => {
  try {
    const { city } = req.query;
    const coords = await weatherData.getCoordinates(city);
    res.json(coords);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/hourly', async (req, res) => {
  try {
      const location = req.query.location;

      if (!location || typeof location !== 'string') {
        throw new Error('Location must be a valid string');
      }

      const hourlyForecast = await weatherData.getHourlyForecast(location);

      if (!hourlyForecast || hourlyForecast.length === 0) {
        return res.status(404).send('Hourly forecast not available');
      }

      return res.json(hourlyForecast);
      } catch (e) {
      console.error(e);
      return res.status(500).send(e.message);
    }
});

export default router;
