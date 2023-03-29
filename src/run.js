const TcpTransmisorController = require("./infrastructure/controller");
const logger = require("./utils/logger");
// const loggerTramas = require("./utils/loggerTramas");

this.connectServer = new TcpTransmisorController(logger);
this.connectServer.tcpTransmisorController();
