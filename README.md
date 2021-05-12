## Requiments

* [transcription-mvp-backend](https://git.informatik.uni-hamburg.de/7zierahn/transcription-mvp-server) up and running
* [Node.js](https://nodejs.org/en/)

## Run frontend with npm

For starting the transcription frontend simply run following commands:

```shell
npm install
npm start
```

## Run frontend with docker

```shell
docker build -t chicken-transcription-frontend .
docker run --rm -it -p 3000:3000 chicken-transcription-frontend
```

Go to [http://localhost:3000](http://localhost:3000)

## Build a static stand alone release for the [transcription-mvp-backend](https://git.informatik.uni-hamburg.de/7zierahn/transcription-mvp-server)

```shell
rm -rf build
npm run-script build
rm -rf ../transcription-mvp-backend/src/main/resources/frontend
cp -r build ../transcription-mvp-backend/src/main/resources/frontend
```
