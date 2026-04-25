# 🤖 Dark's Services Bot — Guida Completa

## 📁 Struttura File

```
darkbot/
├── index.js              ← File principale del bot
├── deploy-commands.js    ← Registra i comandi slash
├── package.json          ← Dipendenze
├── .env                  ← ⚠️ I tuoi token segreti (NON condividere!)
├── .env.example          ← Modello del .env
├── commands/
│   ├── sell.js           ← /sell  → pubblica annuncio account
│   ├── setup.js          ← /setup → invia pannelli (ticket, rules, ecc.)
│   ├── vouch.js          ← /vouch → lascia una recensione
│   └── ticket.js         ← /ticket → apre ticket manuale
└── events/
    ├── ready.js          ← Evento avvio bot
    └── interactionCreate.js ← Gestisce tutti i click e i moduli
```

---

## 🪜 PASSO 1 — Crea il Bot su Discord Developer Portal

1. Vai su **https://discord.com/developers/applications**
2. Clicca **"New Application"** → dai un nome (es: "Dark's Services")
3. Vai su **"Bot"** nel menu a sinistra
4. Clicca **"Add Bot"** → conferma
5. Clicca **"Reset Token"** → **copia il TOKEN** (lo usi dopo!)
6. Sotto **"Privileged Gateway Intents"**, attiva:
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
7. Vai su **"OAuth2" → "URL Generator"**
   - Seleziona: `bot` e `applications.commands`
   - Permessi bot: `Administrator` (più semplice per iniziare)
   - Copia l'URL generato e aprilo nel browser per **invitare il bot nel tuo server**

---

## 🪜 PASSO 2 — Installa Node.js sul tuo PC

1. Vai su **https://nodejs.org** e scarica la versione **LTS**
2. Installala (avanti, avanti, fine)
3. Apri il **Terminale** (Windows: cerca "cmd" o "PowerShell")
4. Verifica: digita `node -v` → deve mostrarti una versione (es: v20.x.x)

---

## 🪜 PASSO 3 — Configura i File del Bot

1. Crea una cartella chiamata `darkbot` sul desktop
2. Metti tutti i file dentro (rispetta la struttura sopra)
3. **Crea il file `.env`** nella cartella principale:

```
TOKEN=metti_qui_il_token_copiato_prima
CLIENT_ID=metti_qui_l_id_del_bot
GUILD_ID=metti_qui_l_id_del_server

TICKET_CATEGORY_ID=id_categoria_ticket
VOUCHES_CHANNEL_ID=id_canale_vouches
PARTNERSHIP_CHANNEL_ID=id_canale_partnership
ACCOUNTS_CHANNEL_ID=id_canale_accounts

STAFF_ROLE_ID=id_ruolo_staff
```

### 🔍 Come trovare gli ID:
- Su Discord: **Impostazioni → Avanzate → Modalità sviluppatore** (attivala)
- Poi **tasto destro su un canale/ruolo/server** → "Copia ID"

### 🔍 Come trovare il CLIENT_ID del bot:
- Developer Portal → la tua app → "General Information" → **Application ID**

---

## 🪜 PASSO 4 — Installa le Dipendenze

1. Apri il terminale **nella cartella `darkbot`**
   - Windows: nella cartella, shift+tasto destro → "Apri finestra PowerShell qui"
2. Digita:
   ```
   npm install
   ```
3. Aspetta che finisca (scarica discord.js e dotenv)

---

## 🪜 PASSO 5 — Registra i Comandi Slash

Nel terminale (sempre nella cartella `darkbot`):
```
node deploy-commands.js
```
Dovresti vedere: `✅ Comandi registrati con successo!`

---

## 🪜 PASSO 6 — Avvia il Bot

```
node index.js
```
Dovresti vedere: `✅ Bot online come Dark's Services#XXXX`

---

## 🪜 PASSO 7 — Configura i Canali nel Server

Crea questi canali nel tuo server Discord:
- 📁 Categoria: **Tickets** (per i ticket, prendi l'ID)
- 📣 Canale: **#accounts** (gli annunci di vendita)
- ⭐ Canale: **#vouches** (le recensioni)
- 🤝 Canale: **#partnership** (le richieste di partnership)

Poi aggiorna il file `.env` con gli ID di questi canali!

---

## 🪜 PASSO 8 — Usa i Comandi

### Come Admin/Staff nel server:

| Comando | Cosa fa |
|---------|---------|
| `/setup tipo:Ticket` | Invia il pannello ticket nel canale corrente |
| `/setup tipo:Rules` | Invia le regole nel canale corrente |
| `/setup tipo:Partnership` | Invia il pannello partnership |
| `/setup tipo:Vouches` | Invia il pannello vouches |
| `/sell` | Apre il form per pubblicare un account |
| `/vouch` | Lascia una recensione |
| `/ticket` | Apre un ticket manuale |

### Come funziona la vendita account `/sell`:

Il form chiede:
1. **Titolo** → es: "New Account 1776938975743"
2. **Coppe | Prezzo | P11** → es: "100000 | 300 | 101"
3. **Hypercharge | Master** → es: "101 | 1(2025) 7(2024)"
4. **Info extra** → es: "l1 pl id changeable, 2 rank 35"
5. **Note** → facoltativo

L'annuncio appare nel canale #accounts con:
- 🛒 **Buy** → apre automaticamente un ticket con l'annuncio allegato
- ✅ **Sold [STAFF]** → elimina l'annuncio (solo staff)

---

## ⚠️ Note Importanti

- **NON condividere mai il tuo TOKEN!** È come una password
- Il bot deve essere **sempre acceso** per funzionare (o usa un VPS/hosting)
- Per hosting gratuito: prova **Railway.app** o **Render.com**
- Ogni volta che modifichi i comandi slash, ri-esegui `node deploy-commands.js`

---

## 🆘 Problemi Comuni

| Errore | Soluzione |
|--------|-----------|
| "TOKEN non valido" | Controlla il .env, rigenera il token dal portal |
| "Missing Permissions" | Il bot deve avere i permessi nel server |
| Comandi non appaiono | Esegui di nuovo `node deploy-commands.js` |
| "Cannot read .env" | Assicurati che il file si chiami esattamente `.env` |
