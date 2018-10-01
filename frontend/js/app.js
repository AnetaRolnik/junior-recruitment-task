document.addEventListener("DOMContentLoaded", function(){

    const list = document.querySelector(".toDoList");
    const form = document.querySelector(".toDoList-add");
    const tooltip = form.querySelector("div");
    let input = document.querySelector(".toDoList-input");

    //get data from api using Ajax
    const xhrGet = new XMLHttpRequest();
    xhrGet.open("GET", "https://todo-simple-api.herokuapp.com/todos?page=1&page_size=40", true);

    xhrGet.addEventListener('load', function() {
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);

            response.data.map(el => {
                //if you want IE11 and OperaMini to support this way of string declaration, you have to use babel
                if (el.isComplete) {
                    let task = `<li class="toDoItem done" data-id="${el.id}" draggable="true">
                        <label> ${el.title}
                            <input class="checkbox" type="checkbox" checked>
                            <span class="checkmark"></span>
                        </label>
                        <button>
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>`;
                    list.innerHTML += task;

                } else {
                    let task = `<li class="toDoItem" data-id="${el.id}" draggable="true">
                        <label> ${el.title}
                            <input class="checkbox" type="checkbox">
                            <span class="checkmark"></span>
                        </label>
                        <button>
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>`;
                    list.innerHTML += task;
                }
            })
             //drag&drop list items
            const elements = document.querySelectorAll('.toDoItem');
            [].forEach.call(elements, addDnDHandlers);
        }
        xhrGet.addEventListener('error', function() {
            console.error('Connection error!')
        });
    });

    xhrGet.send();


    //post data to api using Ajax
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        //form validation
        const regEx= /^\s*$/;

        if (regEx.test(input.value)) {
            input.classList.add("required");
            tooltip.classList.add("tooltip");

        } else {
            const xhrPost = new XMLHttpRequest();
            xhrPost.open("POST", "https://todo-simple-api.herokuapp.com/todos", true);
            xhrPost.setRequestHeader("Content-type", "application/json");

            xhrPost.addEventListener('load', function () {
                if (this.status === 200) {
                    const response = JSON.parse(this.responseText);

                    let newTask = `<li class="toDoItem" data-id="${response.data.id}" draggable="true">
                        <label> ${response.data.title}
                            <input class="checkbox" type="checkbox">
                            <span class="checkmark"></span>
                        </label>
                        <button>
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>`;
                    list.innerHTML += newTask;

                    //drag&drop list items
                    const elements = document.querySelectorAll('.toDoItem');
                    [].forEach.call(elements, addDnDHandlers);
                }
            });

            xhrPost.send(JSON.stringify
                ({
                    "title": input.value,
                    "description": "",
                    "isComplete": false
                })
            );
            input.value = "";
            input.classList.remove("required");
            tooltip.classList.remove("tooltip");
        }
    })


    //delete item using Ajax
    document.body.addEventListener("click", function(e) {
        if (e.srcElement.className === 'fas fa-trash-alt') {
            const xhrDelete = new XMLHttpRequest();
            const item = e.srcElement.parentElement.parentElement;
            const id = item.dataset.id;

            xhrDelete.open("DELETE", "https://todo-simple-api.herokuapp.com/todos/" + id, true);

            xhrDelete.addEventListener('load', function () {
                if (this.status === 200) {
                    item.remove()
                }
            });

            xhrDelete.send();
        }
    })

    //put request with ajax
    document.body.addEventListener("click", function(e) {
        if (e.srcElement.className === 'checkbox') {
            const xhrPut = new XMLHttpRequest();
            const item = e.srcElement.parentElement.parentElement;
            const title = item.querySelector('label').innerText;
            const id = item.dataset.id;

            xhrPut.open("PUT", "https://todo-simple-api.herokuapp.com/todos/" + id, true);
            xhrPut.setRequestHeader("Content-type", "application/json");

            xhrPut.addEventListener('load', function () {
                if (this.status === 200) {
                    e.srcElement.checked ? item.classList.add("done") : item.classList.remove("done");
                }
            });

            if (e.srcElement.checked) {
                xhrPut.send(JSON.stringify
                    ({
                        "title": title,
                        "description": "",
                        "isComplete": true
                    })
                )
            } else {
                xhrPut.send(JSON.stringify
                    ({
                        "title": title,
                        "description": "",
                        "isComplete": false
                    })
                )
            }
        }
    });


    //drag&drop list items
    let dragSrcEl = null;

    function handleDragStart(e) {
        dragSrcEl = this;

        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.outerHTML);

        this.classList.add('dragElem');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        this.classList.add('over');

        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    function handleDragEnter(e) {
    }

    function handleDragLeave() {
        this.classList.remove('over');
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        if (dragSrcEl !== this) {
            this.parentNode.removeChild(dragSrcEl);
            let dropHTML = e.dataTransfer.getData('text/html');
            this.insertAdjacentHTML('beforebegin',dropHTML);
            let dropElem = this.previousSibling;
            addDnDHandlers(dropElem);
        }
        this.classList.remove('over');
        return false;
    }

    function handleDragEnd() {
        this.classList.remove('over');
    }

    function addDnDHandlers(elem) {
        elem.addEventListener('dragstart', handleDragStart, false);
        elem.addEventListener('dragenter', handleDragEnter, false)
        elem.addEventListener('dragover', handleDragOver, false);
        elem.addEventListener('dragleave', handleDragLeave, false);
        elem.addEventListener('drop', handleDrop, false);
        elem.addEventListener('dragend', handleDragEnd, false);
    }
})
