let myNotes = [];
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");
let myTabs = [];

const notesFromLocalStorage = JSON.parse(localStorage.getItem("myNotes"));
const tabsFromLocalStorage = JSON.parse(localStorage.getItem("myTabs"));

if (notesFromLocalStorage) {
  myNotes = notesFromLocalStorage;
  myTabs = tabsFromLocalStorage;
  render(myNotes, myTabs);
}

tabBtn.addEventListener("click", function () {
  let notes = inputEl.value;
  inputEl.value = "";
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabUrl = tabs[0].url;
    const tabTitle = tabs[0].title;
    if (!myNotes.includes(tabUrl)) {
      myNotes.push(tabUrl);
      myTabs.push(tabTitle);
    }
    localStorage.setItem("myNotes", JSON.stringify(myNotes));
    localStorage.setItem("myTabs", JSON.stringify(myTabs));
    localStorage.setItem(tabUrl, notes);
    render(myNotes, myTabs);
  });
});

function render(notes, tabs) {
  let listItems = "";
  for (let i = 0; i < notes.length; i++) {
    listItems += `
      <li>
        <a href='#' id=${notes[i]}>
          ${tabs[i]}
        </a>
      </li>
    `;
  }
  ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("click", function () {
  localStorage.clear();
  myNotes = [];
  myTabs = [];
  render(myNotes, myTabs);
});

ulEl.addEventListener("click", function (event) {
  if (event.target.tagName === "A") {
    const noteID = event.target.id;
    inputEl.value = localStorage.getItem(noteID);
  }
});
