const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUVB0ZTNpanZva1Bva2U5UmI2WG4yM1h4LzhOd2JrWFdHdUxHdGxiRFBIbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRkgyeVN1WUdzY0trbzNCdm5HMXN1K1dZaHRXS3NWK0tzRlBxUnN6ak5Xcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIyTFhoTlU0YW4xL0RjcE1kc1dBU0NaYW5seDdiYkJBODU3TU0veDdFNFdNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJkYUZXanlzZEVTcTlEMnRDQXNoWVNCNXQvZ2ZQYVdQYXBLenFWSlNLYkdRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNBQ1B1cmx4eThpdjNJQjh6VzlKcGV4OUJMd254U1cwR1BzNkwyOE9IV009In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNpT2kxSWx5Z2laMFpkVmdkTWFCbE5xcUx1VXpITlE0bGhJM1A5SHVBMFk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0ZJSzVWandyV1lGck5RZitTeUVoWmVxMUhldXZ6UjZvWEYyL1FxaFAxST0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidHc2LzlodjhsWFNNQ01ldVl5TTBKZU9uQkNiOEFsLzBmYkdENXlZYlVpaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlNCbDIvVlljZlJ2RUpabzdvWDRYeWdjWWxxcFhiWFJKRldxM0JWK1MvTm11LzBMazJQbkFPRFA2dWJ3M3FaQlJBSUEweDlJenNtL0kvOHpMbk80WERnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6ODUsImFkdlNlY3JldEtleSI6IjZ3YTFWb25ROXpJb0xJYkQwcFArbW5DNzR2ZWN4V2lWYk4yeEREU3ZnR3M9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6ImdJcnRZUmlmUmotTTVIMmdxOVA3SWciLCJwaG9uZUlkIjoiY2JhYWQxMjYtNTllMC00YTMzLWIzN2MtOWQ0ZTM5M2ZiODg5IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRpUVdYTFViY29FN3hicnZuS2dkeE1BTXQ4ND0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIwVU1VUjVFbVB5SDJRcmtEdXdxUHI3VUlQcFE9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiSERCQ0hGVDQiLCJtZSI6eyJpZCI6IjkyMzQxOTE1OTY3MDo5NkBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT1NudlpjR0VKTDg2clFHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiUDhISS9uNkdGZlhsdHcwazZvL3JsV1dRTTN4M3FQeTZ3MXBZTzB5WFIzOD0iLCJhY2NvdW50U2lnbmF0dXJlIjoiWWg4V3hQdTNoVnBvVnZSN1pBVmR6QkJnaXg2RHg5b25heTFPcU1ESzkzNzBpaHAyWFp2SWxJMFVkZDFRMzBIZTY2dGxXbWhTMmNEcG8xekQ4R3ZqQ0E9PSIsImRldmljZVNpZ25hdHVyZSI6ImRpSEkxY0x6WUVIQmEwZ3FlQ2RmRGhmVCtZZGNCa3JsY1RVaUNGT0Y3c2VsbG1RY1lvbGtUWUdJdnJKZFZNYjcyd091L0hKMjZNeHJFK0oxekpFeERBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTIzNDE5MTU5NjcwOjk2QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlQvQnlQNStoaFgxNWJjTkpPcVA2NVZsa0ROOGQ2ajh1c05hV0R0TWwwZC8ifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjE0MTcyNDcsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTnR6In0=',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "M ASWAD",
    NUMERO_OWNER : process.env.OWNER_NUM || "923419159670",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "true",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'true',
    BOT : process.env.BOT_NAME || 'M ASWAD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/e07a3d933fb4cad0b3791.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || 'recording',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    TZ : process.env.TIME_ZONE || 'Etc/GMT',
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    BOOM_MESSAGE_LIMIT : process.env.BOOM_MESSAGE_LIMIT || 100,
    PORT : process.env.PORT || 8000,
    LINK : process.env.LINK || '',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://tkm:Aqi6tqwyv5IwDHncTtVi5XtMGZvfndDJ@dpg-cqahogtds78s739sl81g-a.oregon-postgres.render.com/takudzwa" : "postgresql://tkm:Aqi6tqwyv5IwDHncTtVi5XtMGZvfndDJ@dpg-cqahogtds78s739sl81g-a.oregon-postgres.render.com/takudzwa",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`update ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
