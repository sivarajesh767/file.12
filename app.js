const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const app = express()

const databasePath = path.join(__dirname, 'cricketTeam.db')
app.use(express.json())

let database = null
const initlizeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () =>
      console.log(`Server Running at http://localhost:3000/`),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initlizeDbAndServer()

const convertDbObjectToReceverObject = dbObject => {
  return {
    player_id: dbObject.playerId,
    player_name: dbObject.playerName,
    jersey_number: dbObject.jerseyNumber,
    role: dbObject.role,
  }
}

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `
    SELECT
    *
    FROM
    cricket_team;`

  const playerArray = await database.all(getPlayerQuery)
  response.send(
    playerArray.map(eachPlayer => convertDbObjectToReceverObject(eachPlayer)),
  )
})

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getPlayersQuery = `
    SELECT
    *
    FROM 
    cricket_team
    WHERE 
    player_id = ${playerId};`

  const players = await database.get(getPlayersQuery)
  response.send(convertDbObjectToReceverObject(players))
})

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const postPlayerQuery = `
    INSERT INTO
    cricket_team(player_name, player_number, role)
    VALUES
    ('${playerName}', ${playerNumber}, '${role})
    WHERE
    player_id = ${playerId};`

  const player = await database.run(postPlayerQuery)
  response.send('Player Added to Team')
})

app.put('/players/:playerId', async (request, response) => {
  const {playerName, playerNumber, role} = request.body
  const {playerId} = request.params

  const updatePlayerQuery = `
    UPDATE
    cricket_team
    SET 
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
    WHERE
    player_id = ${playerId};`

  await database.run(updatePlayerQuery)
  response.send('Player Details Update')
})

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
    DELETE FORM
    cricket_team
    WHERE 
    player_id = ${playerId};`

  await database.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
