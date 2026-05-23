const addNewTask = ()=>{
    // <div class="task" id="task" draggable="true" contenteditable="true">
    //     New Task
    // </div>

    let uuid = new Date().getTime().toString(36) + Math.random().toString(36).slice(2)
 
    let newtask = createTaskElement(uuid, "tasks", "new Task")

    document.querySelector("#tasksArea").appendChild(newtask)
}

const createTaskElement = (id, status, text)=>{
    let newtask = document.createElement("div")
    newtask.setAttribute("class", "task")
    newtask.setAttribute("id", "task")
    newtask.setAttribute("data-id", id)
    newtask.setAttribute("data-status", status)
    newtask.setAttribute("draggable", "true")
    newtask.setAttribute("contenteditable", "true")
    newtask.innerText = text
    newtask.addEventListener("dragstart", (e)=>{
        console.log(e.target.id)
        event.dataTransfer.setData("text/plain", e.target.dataset.id)
    })

    newtask.addEventListener("focusout", (e)=>{
        save()
    })

    return newtask
}

const save = ()=>{
    let tasks = document.querySelectorAll("#task")
    let safeData = {"tasks" : []}
    tasks.forEach((element) => {
        let taskdata = [
            element.dataset.id,
            element.dataset.status, 
            element.innerText
        ]
        // console.log(taskdata)
        safeData.tasks.push(taskdata)
    })
    localStorage.setItem("kanban", JSON.stringify(safeData))
}

const load = ()=>{

    const taskArea = document.querySelector("#tasksArea")
    const inprogressArea = document.querySelector("#inprogressArea")
    const doneArea = document.querySelector("#doneArea")

    
    let loadedData = localStorage.getItem("kanban")
    if(loadedData){
        let tasksData = JSON.parse(loadedData)
        tasksData.tasks.forEach((e)=>{
            let newTaskElement = createTaskElement(e[0], e[1], e[2])
            
            if(e[1] == "tasks"){
                taskArea.appendChild(newTaskElement)
            }
            if(e[1] == "inprogress"){
                inprogressArea.appendChild(newTaskElement)
            }
            if(e[1] == "done"){
                doneArea.appendChild(newTaskElement)
            }
        })        
    }
}


window.onload = (e)=>{
    const taskArea = document.querySelector("#tasksArea")
    const inprogressArea = document.querySelector("#inprogressArea")
    const doneArea = document.querySelector("#doneArea")
    
    const addTaskBtn = document.querySelector("#addTaskButton")
    const deleteButton = document.querySelector("#deleteButton")

    addTaskBtn.addEventListener("click", (e)=>{
        addNewTask()
        save()
    })

    // let task = document.querySelector("#task")
    
    deleteButton.addEventListener("dragover", (e)=>{
        event.preventDefault()
    })
    taskArea.addEventListener("dragover", (e)=>{
        event.preventDefault()
    })
    inprogressArea.addEventListener("dragover", (e)=>{
        event.preventDefault()
    })
    doneArea.addEventListener("dragover", (e)=>{
        event.preventDefault()
    })

    
    deleteButton.addEventListener("drop", (e)=>{
        event.preventDefault()
        const id = event.dataTransfer.getData("text/plain")
        console.log("delete ID: " + id)
        let task = document.querySelector("[data-id=" + id + "]")
        task.remove()
        save()
    })
    taskArea.addEventListener("drop", (e)=>{
        event.preventDefault()
        const id = event.dataTransfer.getData("text/plain")
        console.log("ID: " + id)
        let task = document.querySelector("[data-id=" + id + "]")
        task.dataset.status = "tasks"
        // console.log(task)
        taskArea.appendChild(task)
        save()
    })
    inprogressArea.addEventListener("drop", (e)=>{
        event.preventDefault()
        const id = event.dataTransfer.getData("text/plain")
        console.log("ID: " + id)
        let task = document.querySelector("[data-id=" + id + "]")
        task.dataset.status = "inprogress"
        // console.log(task)
        inprogressArea.appendChild(task)
        save()
    })
    doneArea.addEventListener("drop", (e)=>{
        event.preventDefault()
        const id = event.dataTransfer.getData("text/plain")
        console.log("ID: " + id)
        let task = document.querySelector("[data-id=" + id + "]")
        task.dataset.status = "done"
        // console.log(task)
        doneArea.appendChild(task)
        save()
    })

    load()

}