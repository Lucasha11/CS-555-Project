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

export default router;