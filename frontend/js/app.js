document.addEventListener("DOMContentLoaded", function(){

    const list = document.querySelector(".toDoList");
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "https://todo-simple-api.herokuapp.com/todos?page=1&page_size=10", true);

    xhr.addEventListener('load', function() {
        if (this.status === 200) {
            const resp = JSON.parse(this.responseText);

            resp.data.map(el => {

                let task = `<li class="toDoItem">
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

        } else {
            console.log('The connection ended with status ' + this.status)
        }
    });

    xhr.addEventListener('error', function(e) {
        console.error('Connection error!')
    });
    xhr.send();

})