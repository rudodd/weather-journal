/**
 * Global Variables
 */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// Set API url variables
const baseUrl = 'https://api.openweathermap.org/data/2.5/';
const apiKey = 'accf8447fbeac4e229a62e2091fa39a3';

// Set variables to be updates later
let zip, userResponse, endPointUrl;

/**
 * Async Functions
 */

// Fetch endpoint
let currentTemp;
const apiData = async (url) => {
  let request = await fetch(url);
  try {
    currentWeather = await request.json();
    currentTemp = currentWeather.main.temp;
  }
  catch(error) {
    console.log("Error fetching data from the API", error);
  }
};

// Post current data to the server
const postData = async (temp)=> {
  let currentData = {"temp": temp, "date": newDate, "userRes": userResponse,};
  const response = await fetch('/post-data', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(currentData),
  });
  try {
    return response;
  } catch(error) {
    console.log("Error posting data to the server", error);
  }
}

// Get all entry data from the server
const getData = async ()=> {
  const request = await fetch('get-data');
  try {
    allData = await request.json();
    updateEntry(allData);
  } catch(error) {
    console.log('Error retrieving data from server', error);
  }
}

/**
 * Helper functions
 */

// Update the DOM with the most recent entry
const updateEntry = (data)=> {
  let first = true;
  if (data.entries.length) {
    for (entry of data.entries) {
      if (first == true) {
        document.getElementById('date').innerText = entry.date;
        document.getElementById('temp').innerText = entry.temp;
        document.getElementById('content').innerText = entry.userRes;
        first = false;
      }
    }
  } else {
    document.getElementById('date').innerText = 'No entries yet';
  }
}

// Generate entry and update DOM on submit
const generateEntry = ()=> {
  apiData(endPointUrl)
    .then(function(data) {
      postData(currentTemp)
    })
    .then(function(data) {
      getData()
    })
}

/**
 * Event listners
 */

document.addEventListener("DOMContentLoaded", getData());

// Set event listner on the generate button
document.getElementById('generate').addEventListener('click', ()=> {
  zip = document.getElementById('zip').value !== ''? document.getElementById('zip').value : '78727';
  userResponse  = document.getElementById('feelings').value !== '' ? document.getElementById('feelings').value : 'None';
  endPointUrl = `${baseUrl}weather?zip=${zip},us&APPID=${apiKey}&units=imperial`;
  generateEntry();
});