const http = require('http')
const axios = require('axios')
const url = "http://67.205.184.183:3000/config/api";



class ApiConnection {

    async clientsApi() { 
        let optionsdata;
        await axios.get(url).then(response => {
            optionsdata= response.data;
        })
        return optionsdata;
    }

}

module.exports = ApiConnection;