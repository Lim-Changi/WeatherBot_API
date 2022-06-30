# WeatherBot API

### Framework
* NestJS
### 실행 환경
* Nest v8.1.8
* node v17.3.0
* npm v8.3.0


### 실행방법
1. Main Branch Git Clone
2. 루트 경로에 .env 생성
```yml
NODE_ENV=production
PORT=8080
WEATHER_API_HOST='https://thirdparty-weather-api-v2.droom.workers.dev'
CURRENT_ENDPOINT='/current'
FORECAST_ENDPOINT='/forecast/hourly'
HISTORICAL_ENDPOINT='/historical/hourly'
API_KEY='?api_key=CMRJW4WT7V3QA5AOIGPBC'
REQUEST_TIMEOUT_LIMIT=1500
```
3. Dependency Install `npm ci`
4. `npm run build`
5. `npm run start:prod`
6. 날씨 API 테스트
   1. Swagger API Docs: [localhost:8080/docs]()
      * 날씨 API `GET  /summary ` API 테스트
   2. Postman
      * `GET` `localhost:8080/summary?lat=&lon=`
      * `lat` `lon` Query Param 에 위도 경도 값 기입 후, 테스트

> 평균 650~750ms 응답속도 반환
