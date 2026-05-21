const http = require('http');
const mongodb = require('mongodb');

const hostname = '127.0.0.1'; // localhost
const port = 3000;
const url = 'mongodb://127.0.0.1:27017'; // für lokale MongoDB
const mongoClient = new mongodb.MongoClient(url);

async function startServer() {
  await mongoClient.connect(); // Verbindung zur Datenbank herstellen
  server.listen(port, hostname, () => { // Server starten
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

const server = http.createServer(async (request, response) => {
    response.statusCode = 200;
    response.setHeader('Access-Control-Allow-Origin', '*'); // bei CORS Fehler

    let url = new URL(request.url || '', `http://${request.headers.host}`);
    switch (url.pathname) {
      case '/student': {
        const studentCollection = mongoClient.db('university').collection('student');
        switch (request.method) {
          case 'GET':
            let result;
            if(url.searchParams.get('studentNr')){
              result = await studentCollection.find({
                studentNr: Number(url.searchParams.get('studentNr')), // von String zu Zahl konvertieren
              }).toArray();
            }
            else {
              result = await studentCollection.find({}).toArray();
            }
            response.setHeader('Content-Type', 'application/json');
            response.write(JSON.stringify(result));
            break;
          case 'POST':
            let jsonString = '';
            request.on('data', data => {
              jsonString += data;
            });
            request.on('end', async () => {
              studentCollection.insertOne(JSON.parse(jsonString));
            });
            break;
        }
        break;
      }
      case '/clearAll':
        await mongoClient.db('university').collection('student').drop();
        break;
      default:
        response.statusCode = 404;
    }
    response.end();
  }
);

startServer();