import {Router} from 'express';
const router = Router();
import { weatherData } from '../data/index.js';




router
  .route('/forecast/:location')
  .get(async (req, res) => {
    try {
      console.log(req.params.location)

      const weatherList = await weatherData.getDailyForecast(req.params.location);
      console.log(weatherList)
      return res.status(200).json(weatherList);
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

export default router;
