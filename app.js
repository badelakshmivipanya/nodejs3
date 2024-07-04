const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'covid19India.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/states/', async (request, response) => {
  const getStateQuery = `
    SELECT
      *
    FROM
      state
    ORDER BY
      state_id;`
  const stateArray = await db.all(getStateQuery)
  response.send(stateArray)
})
app.get('/states/:stateId/', async (request, response) => {
  const getStateQuery = `
    SELECT
      *
    FROM
      state
    ORDER BY
      stateId;`
  const stateArray = await db.all(getStateQuery)
  response.send(stateArray)
})

app.post('/districts/', async (request, response) => {
  const districtDetails = request.body
  const {districtName, stateId, cases, cured, active, deaths} = districtDetails
  const adddistrictQuery = `INSERT INTO district(districtName, stateId, cases,cured,active,deaths)
    VALUES("${districtName}","${stateId}","${cases}","${cured}","${active}","${deaths}");`
  const dbResponse = await db.run(adddistrictQuery)
  const districtId = dbResponse.lastID
  response.send('District Successfully Added')
})

app.get('/districts/:districtId/', async (request, response) => {
  const {ditrictId} = request.params
  const getdistrictId = `
    SELECT 
    *
    FROM
    district
    WHERE
    district_id=${districtId};
    `
  const districtArray = await db.all(getdistrictId)
  response.send(districtArray)
})
app.delete('/districts/:districtId/', async (request, response) => {
  const {districtId} = request.params
  const deletedistrictId = `
    DELETE
    *
    FROM
    district
    WHERE
    district_id=${districtId};
    `
  await db.run(deletedistrictId)
  response.send('District Removed')
})


app.put('/movies/:movieId/', async (request, response) => {
  const {moviesId} = request.params
  const movieDetails = request.body
  const {directorId, movieName, leadActor} = movieDetails
  const updateMovieArray = `
  UPDATE
  movie
  SET
  director_id="${directorId}",
  movie_name="${movieName}",
  lead_Actor="${leadActor}"
  WHERE 
  movie_id=${moviesId};`
  await db.run(updateMovieArray)
  response.send('Movie Details Updated')
})


app.get('/states/:stateId/stats/', async (request, response) => {
  const getStatesQuery = `
    SELECT
      *
    FROM
      state
    WHERE
    ORDER BY
      stateId;`
  const stateArray = await db.all(getStateQuery)
  response.send(stateArray)
})

app.get('/districts/:districtId/details/', async (request, response) => {
  const {districtId} = request.params
  const getstateName = `
    SELECT 
    *
    FROM
    district
    WHERE
    district_id=${districtId};
    `
  const stateArray = await db.all(getstateName)
  response.send(stateArray)
})

module.exports = app
