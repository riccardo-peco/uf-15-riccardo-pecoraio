# Meteo App

## Descrizione

Applicazione Angular che permette di consultare le condizioni meteo attuali di una località, date latitudine e longitudine, tramite l'API pubblica di [Open-Meteo](https://open-meteo.com/).

Progetto realizzato per l'esame UF07:WEB (Task 3 — Meteo App), sviluppato seguendo gli standard tecnici richiesti: TypeScript in modalità strict (nessun uso di `any`), stato gestito tramite i `signal` di Angular, logica di business isolata in servizi dedicati, Reactive Forms con `AsyncValidator` per la validazione in tempo reale.

## Funzionalità

- Form per inserire latitudine e longitudine, con validazione sincrona sui range validi (-90/90, -180/180) e un `AsyncValidator` che, con debounce, verifica in tempo reale che le coordinate restituiscano dati validi dall'API.
- Visualizzazione dei dati meteo correnti: temperatura, umidità, precipitazioni, copertura nuvolosa, vento e condizione meteo (tradotta dal `weather_code` in descrizione testuale + icona).
- Persistenza locale dell'ultimo risultato in `localStorage`, ricaricato automaticamente all'avvio dell'app.

## Stack tecnico

- Angular (standalone components, `signal`, nuovo control flow `@if`)
- TypeScript strict mode
- RxJS (per l'`AsyncValidator`)
- Docker + Nginx per il deployment

## Struttura del progetto
```
src/app/
  app.component.ts          shell dell'applicazione (router-outlet)
  app.routes.ts              definizione delle rotte
  app.config.ts               provider globali (router, http client)
  pages/meteo-page/            pagina che orchestra form + visualizzazione
  components/
    weather-form/               form reattivo con AsyncValidator
    weather-display/            componente di visualizzazione dei dati
  services/
    weather.service.ts           logica di business, stato con signal, chiamate HTTP
  models/
    weather.model.ts              interfacce TypeScript
  utils/
    weather-code.util.ts           mappatura weather_code -> descrizione/icona
docs/
  API.md            documentazione dell'API Open-Meteo utilizzata
  DOCKER.md         istruzioni per l'avvio tramite Docker
  PROGETTO.md        questo file
```
## Avvio del progetto

### Con Docker (consigliato)

```bash
docker compose up --build
```
App disponibile su `http://localhost:8080`. Dettagli in [docs/DOCKER.md](./DOCKER.md).

### In locale (senza Docker)

Requisiti: Node.js 20+

```bash
npm install
npm start
```
App disponibile su `http://localhost:4200`.

### Build di produzione

```bash
npm run build
```
I file compilati vengono generati in `dist/meteo-app/browser`.

## Documentazione correlata

- [docs/API.md](./API.md) — dettagli sull'API Open-Meteo e sul campo `weather_code`
- [docs/DOCKER.md](./DOCKER.md) — comandi e configurazione Docker
