let addToDo = document.getElementById("addToDo");
const btn = document.getElementById("btn");
const listActive = document.querySelector(".listActive");
const listDoing = document.querySelector(".listDoing");
const listDone = document.querySelector(".listDone");
let toDos = [];
let dragged; //드래그
const TODO_KEY = "todos";

//드래그 앤 드롭
listActive.addEventListener("dragstart", handleDragStart);
listActive.addEventListener("dragover", handleDragOver);
listDone.addEventListener("dragover", handleDragOver);
listDone.addEventListener("dragenter", handleEnter);
listDone.addEventListener("dragleave", handleLeave);
listDone.addEventListener("drop", handleDrop);
listActive.addEventListener("dragend", handleDragEnd);

//input 입력 & 추가버튼 누를 경우
btn.addEventListener("click", createToDo);
addToDo.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    createToDo(event);
  }
});

function saveToDo() {
  //포맷팅 ,JSON은 개방형 표준 포맷임.
  localStorage.setItem(TODO_KEY, JSON.stringify(toDos));
}
//새로고침 누를때마다 ㅣocal로부터 데이터를 가져와 파싱함.
const savedToDos = localStorage.getItem(TODO_KEY);
if (savedToDos !== null) {
  const parsedToDos = JSON.parse(savedToDos); //문자열을 객체로 생성.
  toDos = parsedToDos; //배열에 parsedToDos를 할당함
  parsedToDos.forEach(printToDo); //배열의 모든 요소에 대해 printToDo 함수 실행함
}

function createToDo(event) {
  event.preventDefault();
  const newToDo = addToDo.value;
  console.log(newToDo);
  addToDo.value = ""; //초기화
  const currentDate = new Date();
  const todoItem = {
    title: newToDo,
    date: currentDate.toLocaleDateString(),
  };
  toDos.push(todoItem);
  printToDo(todoItem); // 화면에 출력.
  saveToDo();
}

//화면에 출력되도록.
function printToDo(todoItem) {
  if (todoItem.title !== "") {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const spanDate = document.createElement("span");

    let deleteBtn = document.createElement("button");
    let doneBtn = document.createElement("input");

    deleteBtn.innerHTML = "삭제";
    doneBtn.type = "checkbox";
    doneBtn.addEventListener("click", handleCheck);
    deleteBtn.addEventListener("click", deleteList);
    span.addEventListener("dblclick", editToDo);
    spanDate.innerHTML = todoItem.date;
    span.innerHTML = todoItem.title;

    li.appendChild(doneBtn);
    li.appendChild(span);
    li.appendChild(spanDate);
    li.appendChild(deleteBtn);
    listActive.appendChild(li);

    function handleCheck() {
      if (doneBtn.checked) {
        li.classList.toggle("complete");
        document.querySelector(".listDone").appendChild(li);
      } else {
        li.classList.remove("complete");
        listActive.appendChild(li);
      }
    }
  }
}

//삭제 기능
function deleteList(e) {
  let removeOne = e.target.parentElement;
  removeOne.remove();
  //localStorage.removeItem(removeOne);

  const todoTitle = removeOne.querySelector("span").innerHTML;
  toDos = toDos.filter((todo) => todo.title !== todoTitle); //삭제한 항목과 일치하지 않은 항목들로만 이루어진 새배열로 할당됨!!@@
  saveToDo(); // 수정된 toDos 배열을 다시 저장
}

//수정 기능
function editToDo() {
  const span = this;
  const li = this.parentNode;
  const input = document.createElement("input");
  input.value = span.innerHTML; //input에는 기존 span의 내용이 들어감.

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      span.innerHTML = input.value; //span의 내용은 input 입력 값으로 할당되는거지.
      li.removeChild(input);
      span.style.display = "inline-block";
    }
  });
  span.style.display = "none";
  // li.appendChild(input);
  li.insertBefore(input, span.nextSibling); //부모 요소의 맨 첫번째로 위치.
  input.focus();
}

function handleDragStart(event) {
  dragged = event.target;
  dragged.classList.add("dragging");
}
function handleDragOver(event) {
  //어떠한 요소든 드래그가 이루어지고 있다면 발생
  event.preventDefault();
}
function handleEnter(event) {
  //드래그하는 요소가 dragenter 이벤트를 달아놓은 요소 안에 진입했을 때
  if (event.target.classList.contains("listDone")) {
    event.target.classList.add("dragover");
  }
}
function handleDragEnd(event) {
  //사용자가 마우스 클릭 버튼을 놓았을
  event.target.classList.remove("dragging");
}
function handleLeave(event) {
  //이벤트가 달린 요소에 들어갔다가 나가는 시점에 발생하는
  if (event.target.classList.contains("listDone")) {
    event.target.classList.remove("dragover");
  }
}
function handleDragEnd(event) {
  event.target.classList.remove("dragging");
}
function handleDrop(event) {
  event.preventDefault();
  if (event.target.classList.contains("listDone")) {
    event.target.classList.remove("dragover");
    event.target.cappendChild(dragged);
    dragged.classList.remove("dragging");
  }
}
