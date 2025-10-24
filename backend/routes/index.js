import weatherRoutes from './weather.js';

const constructorMethod = (app) => {
  app.use('/weather', weatherRoutes);

  app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;