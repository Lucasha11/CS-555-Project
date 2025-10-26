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

/**
 * Fetches 10-day high/low temperature forecasts for a given location.
 */
router
  .route('/extendedForecast')
  .get(async (req, res) => {
    try {

      const location = req.body.location;

      if (!location || typeof location !== 'string'){
        throw new Error('Location must be a valid string')
      }
      const weatherList = await weatherData.getTenDayForecast(location);
      return res.json(weatherList);
      } catch (e) {
      console.log(e);
      return res.status(500).send(e);
      }
    });

export default router;