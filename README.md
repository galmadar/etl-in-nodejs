# ETL system in node.js

## Flow
### "Watch" files
- Files goes into the files folder OR http request is sent to the server
- event/function is published to the next step (read the file)
### Parsing the files
- "General" reader, reads the new csv
- Pass it to the relevant reader (? - we might not need this step because we "always" save specific data)
- **Parse corrupted files**
### Save A LOT OF DATA in the DB
- **Should be scalable**
- **Data deduplication**

## Components
- Watchfile - get updates about new files
- Queue - to store events from the watcher
- Handler for file - a simple function to handle parsing the file
- Logger mechanism (?) - for monitoring corrupted files
- Models for the DB - create OR UPDATE data about the models

## DB
#### NoSQL db - in order to be able saving different "schemas" of collection
- Demands - fast DB to create AND UPDATE millions of rows
