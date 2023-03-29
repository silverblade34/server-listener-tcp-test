const ApiConnection = require("../application/response");
const MainServer = require("./MainServer");

class TcpTransmisorController {
  constructor(logger) {
    this.server = new MainServer(logger);
    // this.apiconnection = new ApiConnection();
    this.logger = logger;
  }

  async tcpTransmisorController() {
    try {
      //   throw "Este es un error de prueba!";
      // const optionsdata = await this.apiconnection.clientsApi();
      // this.logger.
      // await this.server.clientsListen()
      await this.server.serverListen();
      await this.server.serverRun();
      // await this.server.serverConnect(optionsdata);
    } catch (error) {
      this.logger.error(`Controller => ${error}`);
      //   console.log(error);
    }
  }
}

module.exports = TcpTransmisorController;
