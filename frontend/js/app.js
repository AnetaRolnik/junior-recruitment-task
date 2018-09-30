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
                let task = `<li class="toDoItem" data-id="${el.id}">
                    <label> ${el.title}
                        <input type="checkbox">
                        <span class="checkmark"></span>
                    </label>
                    <button>
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </li>`;

                if (el.isComplete) {
                    document.querySelector(".toDoItem").classList.add("done")
                };
                list.innerHTML += task;
            })
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

                    let newTask = `<li class="toDoItem" data-id="${response.data.id}">
                        <label> ${response.data.title}
                            <input type="checkbox">
                            <span class="checkmark"></span>
                        </label>
                        <button>
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </li>`;
                    list.innerHTML += newTask;
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
})
