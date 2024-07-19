const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib0Z0UndFVGVlQk5PaWNKeGtIVkkxMStPbzh1ODBLVjdDdUhOTlYvZ3kzMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRjE1YjBPNHUyWVN5N3c5MHpSeTNlbXU3OGY0aVJsVTFoYUxuS0FPMncxVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJnTFFEVWczSmEydmowcGJ1N2Q5aVEwZ3VhRGo5MFlhUGRnUk1KWUFqN2xBPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxcDBkdG54T0pvY2J2SEMxZzArVlFuK0lKb0xIZTkzZm9Qa0tlTExUS3g4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjZNZU5UL0o5bzRLcUZMc2kyUUtNTis0SkdsQjJBYkpkZjE1Y0ZYTXNTVjA9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjZHdjRnRmRQNzVTKzZaazYwQmxaN2VvVjlsS2ROeHZuRFZzYWtRN1lhR3M9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUxORTY5VzdvNHF6NlMxZDZJR2hYbUxsUm9rSDZPZDZHWFlRMTgzbVNHbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieThRMnFXeWMxMml3OXRGa2w2eUprYnFHYVZmL2U5TnhFQmk4ZVVsNWh3ND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNMR2hpSHFNUW13UXFBNXFRTnh1ZWhuc3NnbFMrcGdaVGcxS3RhbDlGTzQ5MDlldGkzNkNVbWxpSTBEUHBycGNnbXNtZEROOHhHRTU1ZWpLV0hBZ0RnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTEsImFkdlNlY3JldEtleSI6IkExdDZWN2RNMGdXSkI4MjNxZ2QxdmpXeTNIaWpXVVQxSlp6SFk2anRUSVE9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjo2MSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjYxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6InkxUFk2R1lFUk9lM3JKeFBpdk1KdFEiLCJwaG9uZUlkIjoiZWY4N2M4MWMtOWRmMy00Y2YxLWFhYTQtOWFiMWU5Y2ZiYmE1IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZWVjYvL3hucFpmNTBIZG8zeHllOEdTMWp3TT0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJGb2x4QkFFay9DK1JBSzV1V3lTOEVXMnJGUFk9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiUlRXTjlDTjMiLCJtZSI6eyJpZCI6IjkyMzQxOTE1OTY3MDo5NUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT09udlpjR0VKV0I2clFHR0FjZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiUDhISS9uNkdGZlhsdHcwazZvL3JsV1dRTTN4M3FQeTZ3MXBZTzB5WFIzOD0iLCJhY2NvdW50U2lnbmF0dXJlIjoiakxMcGFQbEw3RmZmc3FPRmNRTlNncUp2YTJKYlVSOThlQWR0UXB5ODgram1TaThlWEFRaVJSZi9KM3IzekdBMlMzeTZSR3h3eW5vRlZrdXV6SmpCQVE9PSIsImRldmljZVNpZ25hdHVyZSI6ImlXcDBZbkVLdEFXRzJhdFdwRXBtQ0QzSEpIWFZ6bkVWQWorQXJaMUk2cFhxT2syZCt0SE1EdStETVhBVTNkd25hZGFIcERLV3NhRHllWG5sTXgwU0FnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiOTIzNDE5MTU5NjcwOjk1QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlQvQnlQNStoaFgxNWJjTkpPcVA2NVZsa0ROOGQ2ajh1c05hV0R0TWwwZC8ifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MjE0MDE1MDd9',
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
