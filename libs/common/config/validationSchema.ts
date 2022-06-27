import * as Joi from 'joi';

export const ValidationSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  PORT: Joi.string().required(),
  WEATHER_API_HOST: Joi.string().required(),
  CURRENT_ENDPOINT: Joi.string().required(),
  FORECAST_ENDPOINT: Joi.string().required(),
  HISTORICAL_ENDPOINT: Joi.string().required(),
  API_KEY: Joi.string().required(),
});
