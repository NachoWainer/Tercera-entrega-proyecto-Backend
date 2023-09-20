import winston from "winston";
import "dotenv/config"

const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

const devLogger = () =>
  winston.createLogger({
    levels: levelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug", 
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });

// Crea un logger de producción
const prodLogger = () =>
  winston.createLogger({
    levels: levelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info", 
        format: winston.format.combine(
          winston.format.colorize({ colors: levelOptions.colors }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "./errors.log",
        level: "error", 
        format: winston.format.simple(),
      }),
    ],
  });

export const addLogger = (req, res, next) => {
  let logger;
  if (process.env.NODE_ENV === "PRODUCCION") logger = prodLogger();
  else logger = devLogger();
  req.logger = logger;

  next();
};
