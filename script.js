let universities = [],
  page = 1,
  totalPages = 1,
  limit = 20,
  search = "",
  country = "",
  wishlist,
  tempWishlist;

function renderSearch() {
  const search = document.getElementById("search");
  search.innerHTML = `
    <div class="container">
      <div class="search-bar">
        <form name="myForm" onsubmit="return false">
          <button type="submit">
             <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <input
            type="text"
            placeholder="Search..."
            oninput="handleInput(event)"
          />
        </form>
      </div>
    </div>`;
}

function renderLoading() {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="container">
      <div class="loading-spinner-wrapper f-cen">
        <div class="loading-spinner"></div>
      </div>
    </div>`;
}

function renderCards(universities) {
  const content = document.getElementById("content");
  content.innerHTML = `
    <div class="container">
      <div class="cards">
        ${universities
          .map(
            (university, index) => `
              <div class="card f-col-g-10">
                <h2 class="university-name">
                  ${university.name}
                </h2>
                <div class="university-details f-col-g-10 f-grow">
                  <div class="f-row-g-5">
                    <span>Country:</span>
                    <div class="university-country f-row-g-5">
                      <span>${university.country}</span>
                      <div class="university-country-code f-cen">
                        ${university.alpha_two_code}
                      </div>
                    </div>
                  </div>
                  <div class="f-row-jc-sb f-grow">
                    <div class="f-col-g-10">
                      <span>Web pages:</span>
                      ${university.web_pages
                        .map(
                          (link) =>
                            `<a href=${link} target="_blank">${link}</a>`
                        )
                        .join("\n")}
                    </div>
                    <div class="wish-listed f-cen" onclick="addToTempWhishlist(${index})">
                      ${
                        tempWishlist.includes(JSON.stringify(university))
                          ? `<i class="fa-solid fa-check"></i>`
                          : `<i class="fa-solid fa-plus"></i>`
                      }
                    </div>
                  </div>
                </div>
                
              </div>`
          )
          .join("\n")}
      </div>
    </div>`;
}

function renderPage() {
  page * limit >= universities.length
    ? renderCards(universities.slice((page - 1) * limit))
    : renderCards(universities.slice((page - 1) * limit, page * limit));
}

function renderPaginationButtons() {
  if (page < 3 || totalPages <= 5) {
    return [...Array(totalPages > 5 ? 5 : totalPages)]
      .map(
        (v, i) => `
          <button 
            ${
              page !== i + 1
                ? `class="pagination-btn" onclick="goToPage(${i + 1})"`
                : `class="pagination-btn selected-page"`
            }
          >
            ${i + 1}
          </button>`
      )
      .join("\n");
  } else if (page > totalPages - 2) {
    return [...Array(5)]
      .map(
        (v, i) => `
          <button
            ${
              page !== totalPages + i - 4
                ? `class="pagination-btn" onclick="goToPage(${
                    totalPages + i - 4
                  } )"`
                : `class="pagination-btn selected-page"`
            }
          >
            ${totalPages + i - 4}
          </button>`
      )
      .join("\n");
  } else {
    return [...Array(5)]
      .map(
        (v, i) => `
          <button
            ${
              page !== page + i - 2
                ? `class="pagination-btn" onclick="goToPage(${page + i - 2})"`
                : `class="pagination-btn selected-page"`
            }
          >
            ${page + i - 2}
          </button>`
      )
      .join("\n");
  }
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = `
    <div class="container">
      <div class="pagination-buttons">
        <button class="pagination-btn next-prev-btn" 
          ${page === 1 ? "disabled" : `onclick="goToFirstPage()"`}
        >
          <i class="fa-solid fa-angles-left"></i>
        </button>
        <button class="pagination-btn next-prev-btn" 
          ${page === 1 ? "disabled" : `onclick="goToPrevPage()"`}
        >
          <i class="fa-solid fa-angle-left"></i>
        </button>
        ${renderPaginationButtons()}
        <button class="pagination-btn next-prev-btn" 
          ${page === totalPages ? "disabled" : `onclick="goToNextPage()"`}
        >
          <i class="fa-solid fa-angle-right"></i>
        </button>
        <button class="pagination-btn next-prev-btn" 
          ${page === totalPages ? "disabled" : `onclick="goToLastPage()"`}
        >
          <i class="fa-solid fa-angles-right"></i>
        </button>
      </div>
    </div>`;
  scrollToTop();
}

function renderPageComponents() {
  renderPagination();
  renderLoading();
}

function renderWhishlist() {
  document.getElementById("pagination").innerHTML = "";
  document.getElementById("search").innerHTML = "";
  document.getElementById("content").innerHTML = `
    <div class="container">
      <div class="wishlist">
        ${
          tempWishlist.length > 0
            ? `<table>
              <thead>
                <tr>
                  <th>University Name</th>
                  <th>Country</th>
                  <th>Checked</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                ${tempWishlist
                  .map((item, index) => {
                    const listItem = JSON.parse(item);
                    return `
                <tr>
                  <td>${listItem.name}</td>
                  <td>${listItem.country}</td>
                  <td>
                    ${
                      wishlist.includes(item)
                        ? `<button
                            class="check-btn f-cen"
                            onclick="removeFromWhishlist(${index})"
                          >
                            <i class="fa-solid fa-square-check"></i>
                          </button>`
                        : `<button
                            class="check-btn f-cen"
                            onclick="addToWhishlist(${index})"
                          >
                            <i class="fa-regular fa-square"></i>
                          </button>`
                    }
                  </td>
                  <td>
                    <button 
                      class="delete-btn f-cen" 
                      onclick="removeFromTempWhishlist(${index})"
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              `;
                  })
                  .join("\n")}
              </tbody>
            </table>`
            : `<span class="list-empty f-cen">
                Add universities to your list by pressing the&nbsp;
                <span class="add-btn f-cen">
                  <i class="fa-solid fa-plus"></i>
                </span>
                &nbsp;button
              </span>`
        }
      </div>
    </div>`;
}

async function navigateToAll() {
  document.querySelector(".nav-all").classList.add("selected-tab");
  document.querySelector(".nav-whishlist").classList.remove("selected-tab");
  document.querySelector(".navbar .nav-links").classList.add("hidden");
  page = 1;
  totalPages = 1;
  country = "";
  search = "";
  renderSearch();
  renderPageComponents();
  await getUniversities();
  renderPage();
  renderPagination();
  document
    .querySelector(".search-bar button")
    .addEventListener("click", searchByName, { once: true });
  document.querySelectorAll(".side-menu .side-menu-item").forEach((elem) => {
    elem.addEventListener("click", searchByCountry, { once: true });
    elem.classList.remove("selected");
  });
}

function navigateToWhishlist() {
  document.querySelector(".nav-whishlist").classList.add("selected-tab");
  document.querySelector(".nav-all").classList.remove("selected-tab");
  document.querySelector(".navbar .nav-links").classList.add("hidden");
  search = "";
  renderWhishlist();
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToNextPage() {
  page++;
  renderPage();
  renderPagination();
}

function goToPrevPage() {
  page--;
  renderPage();
  renderPagination();
}

function goToFirstPage() {
  page = 1;
  renderPage();
  renderPagination();
}

function goToLastPage() {
  page = totalPages;
  renderPage();
  renderPagination();
}

function goToPage(pageNumber) {
  page = pageNumber;
  renderPage();
  renderPagination();
}

async function getUniversities(params) {
  const response = await fetch(
    "http://universities.hipolabs.com/search?" +
      new URLSearchParams({
        ...params,
      })
  );
  universities = await response.json();
  totalPages =
    universities.length > 0 ? Math.ceil(universities.length / limit) : 1;
  console.log(universities);
}

async function searchByName(event) {
  event.preventDefault();
  totalPages = 1;
  page = 1;
  renderPageComponents();
  await getUniversities(
    country.length > 0
      ? { name: search.toLowerCase(), country: country.toLowerCase() }
      : { name: search.toLowerCase() }
  );
  renderPage();
  renderPagination();
  document
    .querySelector(".search-bar button")
    .addEventListener("click", searchByName, { once: true });
}

async function searchByCountry(event) {
  document.querySelector(".nav-all").classList.add("selected-tab");
  document.querySelector(".nav-whishlist").classList.remove("selected-tab");
  document.querySelector(".navbar .nav-links").classList.add("hidden");
  event.preventDefault();
  totalPages = 1;
  page = 1;
  country = [...event.target.classList].includes("country-name")
    ? event.target.innerText
    : event.target.querySelector(".country-name").innerText.trim();
  renderSearch();
  renderPageComponents();
  await getUniversities({ country: country.toLowerCase() });
  renderPage();
  renderPagination();
  document
    .querySelector(".search-bar button")
    ?.addEventListener("click", searchByName, { once: true });
  document.querySelectorAll(".side-menu .side-menu-item").forEach((elem) => {
    elem.addEventListener("click", searchByCountry, { once: true });
    if (elem.querySelector(".country-name").innerText === country) {
      elem.classList.add("selected");
    } else {
      elem.classList.remove("selected");
    }
  });
}

function handleInput(event) {
  search = event.target.value;
}

function toggleNavLinks() {
  document.querySelector(".navbar .nav-links").classList.toggle("hidden");
}

function addToTempWhishlist(index) {
  if (
    !tempWishlist.includes(
      JSON.stringify(universities[(page - 1) * limit + index])
    )
  ) {
    tempWishlist.push(JSON.stringify(universities[(page - 1) * limit + index]));
    renderPage();
  }
}

async function removeFromTempWhishlist(index) {
  await removeFromWhishlist(index);
  tempWishlist.splice(index, 1);
  renderWhishlist();
}

function addToWhishlist(index) {
  if (!wishlist.includes(tempWishlist[index])) {
    wishlist.push(tempWishlist[index]);
    localStorage.setItem("wishlist", wishlist.join("\n"));
  }
  renderWhishlist();
}

async function removeFromWhishlist(index) {
  wishlist = wishlist.filter((listItem) => listItem !== tempWishlist[index]);
  localStorage.setItem("wishlist", wishlist.join("\n"));
  renderWhishlist();
}

async function onLoadSite() {
  wishlist =
    localStorage
      .getItem("wishlist")
      ?.split("\n")
      .filter((listItem) => listItem.length > 0) || [];
  tempWishlist = [...wishlist];
  console.log(wishlist);
  navigateToAll();
}
