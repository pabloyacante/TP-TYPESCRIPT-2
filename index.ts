type Person = {
  birth_year: string;
  created: Date;
  edited: Date;
  eye_color: string;
  films: string[];
  gender: string;
  hair_color: string;
  height: number;
  homeworld: string;
  mass: number;
  name: string;
  skin_color: string;
  species: string[];
  starships: string[];
  url: string;
  vehicles: string[];
};

type ServerResponse = {
  count: number;
  results: Person[];
};

// Variables Globales
let displayedPeople: Person[] = [];
let sortBy: any = {};

// Utils
function drawTable(people: Person[]) {
 
  let tableHTML: string = `
  <thead>
    <tr>
      <th><button type="button" class="btn btn-link" onclick=sortPeople("name")>Name</button></th>
      <th><button type="button" class="btn btn-link" onclick=sortPeople("birth_year")>DOB</button></th>
      <th><button type="button" class="btn btn-link" onclick=sortPeople("gender")>Gender</button></th>
      <th><button type="button" class="btn btn-link" onclick=sortPeople("url")>URL</button></th>
    </tr>
  </thead>
  <tbody>
  `;

  people.forEach((p: Person) => {
    tableHTML += `<tr><td>${p.name}</td><td>${p.birth_year}</td><td>${p.gender}</td><td>${p.url}</td></tr>`;
  });
 
  tableHTML += '</tbody>';
 
  document.querySelector('#tableElement')!.innerHTML = tableHTML;
}

// Handlers
function paginateProducts(page: number) {
  fetch(`https://swapi.dev/api/people/?page=${page}`)
    .then(res => res.json())
    .then((data: ServerResponse) => {
      displayedPeople = data.results;
      drawTable(data.results);
    });
}

function filterPeople(value: string) {
  const filteredPeople = displayedPeople.filter((p: Person) => p.name.toLowerCase().includes(value.toLowerCase())
    || p.birth_year.toLowerCase().includes(value.toLowerCase())
    || p.gender.toLowerCase().includes(value.toLowerCase())
    || p.url.toLowerCase().includes(value.toLowerCase()));

  drawTable(filteredPeople);
}

function sortPeople(prop: string) {
  if (sortBy[prop]) {
    if (sortBy[prop] === 'asc') {
      sortBy[prop] = 'desc';
    } else if (sortBy[prop] === 'desc') {
      sortBy[prop] = null;
    }
  } else {
    sortBy = { [prop]: 'asc' };
  } 

  const sortedPeople = displayedPeople.toSorted((a: Person, b: Person) => {
    if (sortBy[prop] === 'asc') {
      return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
    } else if (sortBy[prop] === 'desc') {
      return a[prop] < b[prop] ? 1 : a[prop] > b[prop] ? -1 : 0;
    } else {
      return displayedPeople;
    }
  });

  drawTable(sortedPeople);
}

fetch('https://swapi.dev/api/people')
  .then(res => res.json())
  .then((data: ServerResponse) => {
    displayedPeople = data.results;
    
    drawTable(data.results);

    const pages = Math.ceil(data.count / 10);

    const paginationElement: any = document.querySelector('#paginationElement');
    let pagesHTML = '';

    for (let index = 1; index <= pages; index++) {
      pagesHTML += `<li class="page-item"><a class="page-link" href="#" onclick="paginateProducts(${index})">${index}</a></li>`
    }

    paginationElement.innerHTML = pagesHTML;
    // Hide spinner
    const spinnerElement: HTMLElement = document.querySelector('#spinnerContainer')!;
    spinnerElement.style.display = 'none';
  });