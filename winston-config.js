// Importa las dependencias necesarias
const { createLogger, format, transports } = require('winston');

// Configura los niveles de log personalizados
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
};

// Configura el formato de los logs
const customFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.json(),
);

// Crea el logger de Winston con los niveles y formato personalizados, y agrega los transportes que desees
const logger = createLogger({
  levels: customLevels,
  format: customFormat,
  transports: [
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Exporta el logger para usarlo en tu aplicación
module.exports = logger;