var net = require("net");
var server = net.createServer();
var dataGrid = require("../utils/datagrid");
var env = require('env-smart').load();
// console.log("TEST ENV", env.PORT);


class MainServer {
  constructor(logger) {
    this.logger = logger;
    // this.loggerTramas = loggerTramas;
    // ? production
    // this.SERVER_IP = "159.203.177.210";
    // ? local
    // this.SERVER_IP = "192.168.1.46";
    this.SERVER_IP = '0.0.0.0';

    // this.SERVER_PORT = 9050;
    this.SERVER_PORT =9060;
    this.MONIT_TABLE = {};
    this.DATA_GRID_SERVERS = new dataGrid("Servers");
    // this.DATA_GRID_SERVERS = new dataGrid();
    this.DATA_GRID_CLIENTS = new dataGrid("Clients");
    this.DATA_GRID_DEVICES_AMOUNT = new dataGrid("GPS DEVICES");
    this.DEVICES = [];
  }

  async serverListen() {
    var logger_ = this.logger;
    var dgc = this.DATA_GRID_CLIENTS;
    var dgs = this.DATA_GRID_SERVERS;
    // ! SERVIDOR PRINCIPAL ESCUCHANDO
    server.listen(this.SERVER_PORT, this.SERVER_IP, function () {
      logger_.info(
        `Servidor escuchando en ${JSON.stringify(server.address())}`
      );
      // ! DATAGRID CLIENTE
      // // console.log();
      // dgc.setTitles("IP", "PUERTO", "ESTADO");
      // // console.log(dg);
      // setInterval(() => {
      //   dgc.print();
      //   // dgs.print();
      // }, 5000);
    });
    // ? MANEJO DE ERROR
    server.on("error", (e) => {
      if (e.code === "EADDRINUSE") {
        logger_.info("Address in use, retrying...");
        setTimeout(() => {
          server.close();
          server.listen(this.SERVER_PORT, this.SERVER_IP);
        }, 1000);
      } else {
        logger_.error(`Server: ${e}`);
      }
    });
    // ? OTHER DETAILS
    // toDo:
    // dgs.setTitles("Conns", "State");
    // server.getConnections((err, count) => {
    //   console.log(count);
    //   this.MONIT_TABLE.cantidad = count;
    //   // dgs.setCells(count)
    // });
    // this.MONIT_TABLE.estado = server.listening;
    // dgs.setCells(this.MONIT_TABLE.cantidad, this.MONIT_TABLE.estado);
    // // server.getMaxListeners;
  }

  async serverRun() {
    var logger_ = this.logger;
    // var loggerTramas = this.loggerTramas;
    var dgs = this.DATA_GRID_SERVERS;
    var dgc = this.DATA_GRID_CLIENTS;
    var DEVICES = this.DEVICES;
    var dgd = this.DATA_GRID_DEVICES_AMOUNT;
    // ? CONFIG FOR PRODUCTION
    // const clients_config = {
    //   client1: {
    //     name: "Server_Client1 | port: 31212, ip: 190.152.144.5",
    //     address: { port: 31212, ip: "190.152.144.5" },
    //     isfirstConnect: true,
    //     connected: false,
    //   },
    //   client2: {
    //     name: "Server_Client2 | port: 20479, ip: 64.120.108.24",
    //     address: { port: 20479, ip: "64.120.108.24" },
    //     isfirstConnect: true,
    //     connected: false,
    //   },
    //   client3: {
    //     name: "Server_Client3 | port: 3060, ip: 67.205.184.183",
    //     address: { port: 3060, ip: "67.205.184.183" },
    //     isfirstConnect: true,
    //     connected: false,
    //   },
    // };
    // ? CONFIG FOR DEVELOPER
    const clients_config = {
      client1: {
        name: `Server_Client1 | port: 20898, ip: 193.193.165.165`,
        address: { port: 20898, ip: '193.193.165.165' },
        isfirstConnect: true,
        connected: false,
      },
      client2: {
        name: `Server_Client2 | port: 20471, ip: 193.193.165.161`,
        address: { port: 20471, ip: '193.193.165.161' },
        isfirstConnect: true,
        connected: false,
      },
      client3: {
        name: `Server_Client3 | port: 3060, ip: 134.122.30.27`,
        address: { port: 3060, ip: '134.122.30.27' },
        isfirstConnect: true,
        connected: false,
      },
    };

    // ! CLIENTS SERVERS LISTEN
    const client_1 = net.createConnection(
      clients_config.client1.address,
      () => {
        const msg = `Primera conexión a => ${clients_config.client1.name}`;
        logger_.info(msg);
      }
    );
    const client_2 = net.createConnection(
      clients_config.client2.address,
      () => {
        const msg = `Primera conexión a => ${clients_config.client2.name}`;
        logger_.info(msg);
      }
    );
    const client_3 = net.createConnection(
      clients_config.client3.address,
      () => {
        const msg = `Primera conexión a => ${clients_config.client3.name}`;
        logger_.info(msg);
      }
    );
    // ? Manejo de mensaje al reconectarse
    const messageOnConnect = ({ name, isfirstConnect }) => {
      isfirstConnect ? null : logger_.info(`Conexión restablecida de ${name}`);
      return false;
    };
    client_1.on("connect", () => {
      clients_config.client1.isfirstConnect = messageOnConnect(
        clients_config.client1
      );
      clients_config.client1.connected = true;
    });
    client_2.on("connect", () => {
      clients_config.client2.isfirstConnect = messageOnConnect(
        clients_config.client2
      );
      clients_config.client2.connected = true;
    });
    client_3.on("connect", () => {
      clients_config.client3.isfirstConnect = messageOnConnect(
        clients_config.client3
      );
      clients_config.client3.connected = true;
    });
    // ? fn -> Manejo de error de cada client
    const handleError = (error, logger, client_connection, client_config) => {
      if (error.code === "ECONNREFUSED") {
        logger.info(
          `Conexión de escucha a ${client_config.name} Rechazada, Reintentando conectar...`
        );
        setTimeout(() => {
          client_connection.end();
          client_connection.connect(
            client_config.address.port,
            client_config.address.ip
          );
        }, 1000 * 60);
      } else if (error.code === "ECONNRESET") {
        logger.info(
          `La conexión a ${client_config.name} se cayó, Reintentando conectar...`
        );
        setTimeout(() => {
          client_connection.end();
          client_connection.connect(
            client_config.address.port,
            client_config.address.ip
          );
        }, 1000 * 60);
      } else if (error.code === "ETIMEOUT") {
      } else {
        logger.error(
          `Error unmapped -> ${client_config.name} <-> ${error.message} <-> ${error.code}. <- Retrying to connect`
        );
        setTimeout(() => {
          client_connection.end();
          client_connection.connect(
            client_config.address.port,
            client_config.address.ip
          );
          // client_connection.on("err");
          // logger.info(`Error Msg Test`);
        }, 1000 * 60);
      }
    };
    client_1.on("error", (err) => {
      handleError(err, logger_, client_1, clients_config.client1);
    });
    client_2.on("error", (err) => {
      handleError(err, logger_, client_2, clients_config.client2);
    });
    client_3.on("error", (err) => {
      handleError(err, logger_, client_3, clients_config.client3);
    });
    // ? On close
    client_1.on("close", () => {
      clients_config.client1.connected = false;
    });
    client_2.on("close", () => {
      clients_config.client2.connected = false;
    });
    client_3.on("close", () => {
      clients_config.client3.connected = false;
    });
    // ? BUCLE FOR PRINT DATAGRID
    dgs.setTitles("Nombre", "Estado");
    setInterval(() => {
      dgs.setCells(
        clients_config.client1.name,
        clients_config.client1.connected ? "Online" : "Offline"
      );
      dgs.setCells(
        clients_config.client2.name,
        clients_config.client2.connected ? "Online" : "Offline"
      );
      dgs.setCells(
        clients_config.client3.name,
        clients_config.client3.connected ? "Online" : "Offline"
      );
      dgs.print();
      dgs.reFlush();
    }, 1000 * 60);
    // ! CLIENTS SERVERS LISTEN END

    // ? BUCLE FOR PRINT GPS DEVICES
    dgd.setTitles("CANTIDAD DE EQUIPOS GPS");
    setInterval(() => {
      dgd.setCells(DEVICES.length);
      dgd.print();
      dgd.reFlush();
    }, 1000 * 60);
    // ? BUCLE FOR PRINT GPS DEVICES end
    try {
      // ' throw "ESTE ES UN ERROR GENERADO DENTRO DEL TRY CATCH";
      // * ------------------------
      var objTemp = [];
      // * ------------------------

      // ? SERVER CONNECTIONS
      server.on("connection", function (socket) {
        var remoteFullAdress = socket.remoteAddress + ":" + socket.remotePort;
        var idSetCell;
        logger_.info(
          `Se estableció una nueva conexion GPS (user client) desde ${remoteFullAdress}`
        );

        // ToDo: call module DataGrid / unhidden
        // idSetCell = dgc.setCells(
        //   `${socket.remoteAddress}`,
        //   `${socket.remotePort}`,
        //   `${socket.readyState}`
        // );

        // ? AL RECIBIR DATA DE remoteFullAdress:
        // ? MOTRAR en CONSOLA
        socket.on("data", function (data) {
          // ! un comment
          logger_// logger_.info(`Datos Recibidos de ${remoteFullAdress}: ${data}`);
          // .logger_
          //   .debug(`Datos Recibidos de ${remoteFullAdress}: ${data}`);
          logger_.log(
            "debug",
            `Datos Recibidos de ${remoteFullAdress}: ${data}`
          );
          // loggerTramas.info(`Datos Recibidos de ${remoteFullAdress}: ${data}`);
          // * ------------------------
          let temp = data;
          // let temp = `+RESP:GTFRI,271002,867162029884462,gv300w,25184,10,1,1,0.0,110,2811.0,-78.487711,-0.212959,20220930195845,0740,0001,C418,7D13B2B,00,0.0,,,,100,110000,,,,20221001005857,DACD$`;

          //toDo: uncomment
          // let imei = "867162029884462";
          let imei = temp.toString().split(",")[2];
          // loggerTramas.info(`tramas ${imei}`);
          // logger_.silly(imei);
          // console.log(imei);
          // console.log(this.DEVICES);
          // console.log(DEVICES);
          if (!DEVICES.includes(imei) && typeof imei !== "undefined") {
            // console.log("testing", imei);
            DEVICES.push(imei);
          }
          // console.log(DEVICES);
          // let ddtimei = data.toString().split("271002,")[1];
          // let ddtimei2 = data.toString().split(",gv300w")[1];
          // let imeiv1 = ddtimei.split(",,")[0].split(",gv300w")[0];
          // let imeiv2 = ddtimei.split(",,")[0].split(",gv300w")[0];
          // setTimeout(() => {
          //   console.log(data.toString());
          // }, 1000 * 5);

          // if (imeiv1 == imeiv2) {
          //   objTemp.push(imeiv1);
          // } else if (imeiv1 == ddtimei2) {
          //   objTemp.push(imeiv1);
          // }
          // * --------------------

          // ? REENVIAR A:
          // ToDo: Validar si las conexiones están establecidas para poder .write a cada client
          // setTimeout(() => {
          //   // console.log(
          //   //   "|      FAMILY      |     IP      | PORT | STATE | OTHER |"
          //   // );
          //   client_1.readyState;
          //   console.log(
          //     `|      ${client_1.remoteFamily}        |     ${client_1.remoteAddress}     | ${client_1.remotePort} | ${client_1.readyState}`
          //   );
          //   console.log(
          //     `| ${client_1.localFamily} | ${client_1.localAddress} | ${client_1.localPort}`
          //   );
          // }, 1500);
          client_1.write(data);
          client_2.write(data);
          client_3.write(data);
        });

        // * --------------------
        // const unicos = [];

        // objTemp.forEach((elemento) => {
        //   if (!unicos.includes(elemento)) {
        //     unicos.push(elemento);
        //   }
        // });
        // setInterval(() => {
        //   console.log("IMEIS ENVIANDO TRAMAS");
        //   console.log(unicos);
        //   console.log();
        // }, 1000 * 10);

        // var fs = require("fs");
        // var stream = fs.createWriteStream("myfile.txt");

        // stream.once("open", (fd) => {
        //   for (let unic of unicos) {
        //     stream.write(unic + "\n");
        //   }
        //   stream.end();
        // });
        // * --------------------

        // ? CAPTURAR ERRORES en la Conexiones
        socket.on("error", function (err) {
          logger_.error(
            `"Connection (client) ${remoteFullAdress} error: ${err.message}`
          );
        });
        socket.on("close", () => {
          logger_.info(
            `La conexión GPS (user client) ${remoteFullAdress} has left`
          );
          // toDo: unhidden
          // dgc.updateCell(idSetCell, [
          //   `${socket.remoteAddress}`,
          //   `${socket.remotePort}`,
          //   `${socket.readyState}`,
          // ]);
        });
      });
    } catch (error) {
      logger_.error(`Connection (server) ${error}`);
    }
  }
}

module.exports = MainServer;
