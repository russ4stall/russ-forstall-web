window.addEventListener("DOMContentLoaded", () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
  });

  if (params.data) { 
      const decodedJson = decodeURIComponent(params.data);
      load(JSON.parse(decodedJson));
  }
});

function clearAll() {
  clearItems();
  resetText();
}

function resetItems() {
  const bankElem = document.getElementById("bank");
  document.querySelectorAll(".item").forEach(item => {
      item.classList.remove("placed-item");
      item.dataset.x = 0;
      item.dataset.y = 0;
      bankElem.appendChild(item);
  });
}

function clearItems() {
  document.querySelectorAll(".item").forEach(item => item.remove());
}

function resetText() {
  document.querySelectorAll(".reset-text").forEach(title => {
      const defaultText = title.dataset.default;
      title.innerText = defaultText;
  });
}

function load(data) {
  console.log(data);
  if (!data) return;
  clearItems();
  document.getElementById("main-title").textContent = data.title;
  document.getElementById("q1-label").textContent = data.q1Label;
  document.getElementById("q2-label").textContent = data.q2Label;
  document.getElementById("q3-label").textContent = data.q3Label;
  document.getElementById("q4-label").textContent = data.q4Label;
  document.getElementById("x-axis-label").textContent = data.xLabel;
  document.getElementById("y-axis-label").textContent = data.yLabel;
  document.getElementById("show-quadrants").checked = data.showQuadrants;
  setQuadrantsVisibility(data.showQuadrants);

  var i = 0;
  data.items.forEach(item => {
      createItem(++i, item.text, item.x, item.y, item.isPlaced);
  });
}

function editLabel(ev) {
  const currentText = ev.target.innerText;
  ev.target.innerText = '';
  const id = ev.target.id;
  
  const inputElem = document.createElement("input");
  inputElem.type = "text";
  inputElem.value = currentText;
  inputElem.classList.add("quadrant-title-input");

  inputElem.addEventListener("blur", (event) => {
      const text = event.target.value;
      console.log(text);
      const parentElem = event.target.parentElement;
      parentElem.innerText = text;
      event.target.remove;
  });

  ev.target.appendChild(inputElem);
  inputElem.focus();
}

function addItem(ev) {
  ev.preventDefault();
  const itemTextInput = document.getElementById('add-item');
  if (itemTextInput.value) {
      const newItemId = document.getElementsByClassName('item').length + 1;
      createItem(newItemId, itemTextInput.value);
      itemTextInput.value = '';
  }
}

function dragstart_handler(ev) {
  // Get mouse click offset
  const rect = ev.target.getBoundingClientRect();
  const xOffset = ev.clientX - window.scrollX - parseInt(rect.left,10); 
  const yOffset = ev.clientY - window.scrollY - parseInt(rect.top,10);

  const obj = { id: ev.target.id, mouseOffset: { x: xOffset, y: yOffset } };

  ev.dataTransfer.setData("text/plain", JSON.stringify(obj));
}

function dragover_handler(ev) {
  ev.preventDefault();
}

function dragover_trash(ev) {
  ev.preventDefault();
}

function drop_trash(ev, el) {
  const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
  const droppedItem = document.getElementById(data.id);
  droppedItem.remove();
}

function drop_handler(ev, el) {
  ev.preventDefault();
  
  const quadrantsRect = el.getBoundingClientRect();
  const xOffset = window.scrollX + parseInt(quadrantsRect.left,10); 
  const yOffset = window.scrollY + parseInt(quadrantsRect.top,10);
  const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
  const droppedItem = document.getElementById(data.id);
  const xVal = ev.clientX - data.mouseOffset.x - xOffset;
  const yVal = ev.clientY - data.mouseOffset.y - yOffset;
  droppedItem.classList.add("placed-item");
  droppedItem.style.left = xVal + 'px';
  droppedItem.style.top = yVal + 'px';
  droppedItem.dataset.x = xVal;
  droppedItem.dataset.y = yVal;

  if (ev.target.classList.contains("bank")) {
      droppedItem.classList.remove("placed-item");
      droppedItem.dataset.x = 0;
      droppedItem.dataset.y = 0;
  }
  el.appendChild(droppedItem);
}

function serialize() {
  var items = Array();
  document.querySelectorAll('.item').forEach(item => {
      items.push({
          text: item.innerText,
          x: item.dataset.x,
          y: item.dataset.y,
          isPlaced: item.classList.contains('placed-item')
      });
  });

  const obj = {
      title: document.getElementById("main-title").textContent,
      q1Label: document.getElementById("q1-label").textContent,
      q2Label: document.getElementById("q2-label").textContent,
      q3Label: document.getElementById("q3-label").textContent,
      q4Label: document.getElementById("q4-label").textContent,
      xLabel: document.getElementById("x-axis-label").textContent,
      yLabel: document.getElementById("y-axis-label").textContent,
      showQuadrants: document.getElementById("show-quadrants").checked,
      items
  }

  return JSON.stringify(obj);
}

function shareLink() {
  const url = new URL(window.location.href);
  console.log(url);
  url.search = "data=" + encodeURIComponent(serialize());
  console.log(url.href);
  ``
  navigator.clipboard.writeText(url.href).then(function(x) {
      alert("Link copied to clipboard!");
  });
}

function createItem(id, text, x = 0, y = 0, isPlaced = false) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");
  itemDiv.draggable = true;
  itemDiv.addEventListener("dragstart", dragstart_handler);
  itemDiv.innerText = text;
  itemDiv.dataset.x = x;
  itemDiv.dataset.y = y;
  itemDiv.id = id;
  
  if (isPlaced) { 
      itemDiv.classList.add("placed-item");
      itemDiv.style.left = x + 'px';
      itemDiv.style.top = y + 'px';
      document.getElementById("quadrants").appendChild(itemDiv);
  } else {
      document.getElementById("bank").appendChild(itemDiv);
  }
}

function showSerialized() {
  alert(serialize());
}

function setQuadrantsVisibility(isVisible) {
  const quadrants = document.querySelectorAll('.quadrant');
  quadrants.forEach(q => {
      q.style.visibility = isVisible ? "visible" : "hidden";
  });
}

function toggleQuadrantsVisibility() {
  const quadrants = document.querySelectorAll('.quadrant');
  quadrants.forEach(q => {
      if (q.style.visibility === "hidden") {
          q.style.visibility = "visible";
      } else {
          q.style.visibility = "hidden";
      } 
  });
}