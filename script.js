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

    displayUsers(data);
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
    sortByHead(data, property);
  });
});

totalNumberOfPages = Math.floor(data.length / rowsPerPage);
paginationSpan.textContent = currentPage;

function displayNext() {
  prevBtn.disabled = false;
  paginationSpan.textContent = currentPage;
  if (totalNumberOfPages > currentPage) {
    currentPage++;
    paginationSpan.textContent = currentPage;
  } else if (currentPage === 1) {
    nextBtn.disabled = true;
    prevBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
    prevBtn.disabled = false;
  }

  displayUsers(data);
}

function displayPrev() {
  nextBtn.disabled = false;
  paginationSpan.textContent = currentPage;

  if (currentPage > 1) {
    currentPage--;
    paginationSpan.textContent = currentPage;
  } else if (currentPage === totalNumberOfPages) {
    nextBtn.disabled = false;
    prevBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
    prevBtn.disabled = true;
  }

  displayUsers(data);
}

nextBtn.addEventListener("click", displayNext);
prevBtn.addEventListener("click", displayPrev);
console.log(totalNumberOfPages);

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
  let sortedData = data
    .map((item) => ({
      item,
      sortKey: item[property].toLowerCase(),
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(({ item }) => item);

  displayUsers(sortedData);
}
