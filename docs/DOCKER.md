# Documentazione Docker

## Struttura

- **`Dockerfile`** — build multi-stage:
  1. *Stage `build`*: `node:20-alpine`, esegue `npm install` e `npm run build` (build di produzione Angular).
  2. *Stage finale*: `nginx:alpine`, copia i file statici generati (`dist/meteo-app/browser`) nella document root di nginx e applica la configurazione custom `nginx.conf`.
- **`nginx.conf`** — serve la SPA con fallback su `index.html` per il routing lato client (`try_files $uri $uri/ /index.html`).
- **`docker-compose.yml`** — definisce il servizio `meteo-app`, costruito dal `Dockerfile`, esposto sulla porta host `8080` (mappata sulla `80` del container).
- **`.dockerignore`** — esclude `node_modules`, `dist` e `.angular` dal build context, per build più veloci.

## Comandi

Build e avvio (foreground, con log a video):
```bash
docker compose up --build
```
App raggiungibile su `http://localhost:8080`.

Avvio in background:
```bash
docker compose up -d --build
```

Visualizzare i log (se avviato in background):
```bash
docker compose logs -f
```

Stop e rimozione container:
```bash
docker compose down
```

Solo build dell'immagine, senza avviare il container:
```bash
docker compose build
```

## Note

- Nessuna variabile d'ambiente richiesta: l'app chiama direttamente l'API pubblica di Open-Meteo dal browser del client, quindi non serve un backend proxy né segreti da configurare.
- La porta pubblicata sull'host (`8080`) è configurabile modificando la sezione `ports` in `docker-compose.yml`.

## Troubleshooting

| Problema                          | Soluzione                                                             |
|------------------------------------|-------------------------------------------------------------------------|
| Porta 8080 già occupata            | Cambia il mapping in `docker-compose.yml`, es. `"8081:80"`             |
| Primo build molto lento            | Normale: `npm install` scarica tutte le dipendenze; le build successive sfruttano la cache Docker |
| Pagina bianca dopo l'avvio         | Verifica che il build sia completato senza errori (`docker compose logs`) e che la porta usata nel browser corrisponda a quella pubblicata |