const tableBody = document.querySelector(".table-body");
const table = document.querySelector("table");
const spinner = document.querySelector(".spinner");
const pagination = document.querySelector(".pagination");
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const tableHead = document.querySelectorAll("th");
const paginationSpan = pagination.querySelector("span");

let data = [];
let currentPage = 1;
const rowsPerPage = 5;
let totalNumberOfPages = 0;
let sortDirection = {};
let sortedData = [];

paginationSpan.textContent = currentPage;

async function fetchUserData() {
  spinner.style.display = "block";
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const response = await fetch("https://randomuser.me/api/?results=20");
    const result = await response.json();

    data = result.results.map((user) => ({
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      username: user.login.username,
      country: user.location.country,
    }));
    sortedData = [...data];
    displayUsers(sortedData);
    updateButtons();
    console.log(data);
  } catch (error) {
    console.log(error);
  } finally {
    spinner.style.display = "none";
    table.style.display = "table";
    pagination.style.display = "flex";
  }
}

await fetchUserData();

tableHead.forEach((head) => {
  head.addEventListener("click", () => {
    const property = head.dataset.id;
    sortByHead(sortedData, property);
  });
});

totalNumberOfPages = Math.floor(data.length / rowsPerPage);
paginationSpan.textContent = currentPage;

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayUsers(sortedData);
    updateButtons();
  }
}

function nextPage() {
  if (currentPage < totalNumberOfPages) {
    currentPage++;
    displayUsers(sortedData);
    updateButtons();
  }
}

function displayUsers(users) {
  tableBody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedUsers = users.slice(start, end);

  let userRows = paginatedUsers.map(
    (user) =>
      ` <tr>
            <td data-label="Name">${user.name} </td>
            <td data-label="Email">${user.email}</td>
            <td data-label="Username">${user.username}</td>
            <td data-label="Country">${user.country}</td>
          </tr>
          
          `
  );

  tableBody.insertAdjacentHTML("beforeend", userRows.join(""));
}

function sortByHead(data, property) {
  clearSortIcon();
  updateSortIcon(property, sortDirection);

  if (sortDirection[property] === "asc") {
    sortDirection[property] = "desc";
  } else {
    sortDirection[property] = "asc";
  }
  let sortedData = data
    .map((item) => ({
      item,
      sortKey: item[property].toLowerCase(),
    }))
    .sort((a, b) => {
      if (sortDirection[property] === "asc") {
        return a.sortKey.localeCompare(b.sortKey);
      } else {
        return b.sortKey.localeCompare(a.sortKey);
      }
    })
    .map(({ item }) => item);

  displayUsers(sortedData);
}

function updateButtons() {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalNumberOfPages;
  paginationSpan.innerText = currentPage;
}

function updateSortIcon(property) {
  tableHead.forEach((head) => {
    if (head.dataset.id === property) {
      if (sortDirection[property] === "asc") {
        head.innerHTML = `Name <i class="fas fa-sort-down" id="icon-0"></i>`;
      } else {
        head.innerHTML = `Name <i class="fas fa-sort-up" id="icon-0"></i>`;
      }
    } else {
      head.style.color = "white";
    }
  });
}

function clearSortIcon() {
  tableHead.forEach((head) => {
    head.innerHTML = `Name <i class="fas fa-sort" id="icon-0"></i>`;
  });
}

prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);
