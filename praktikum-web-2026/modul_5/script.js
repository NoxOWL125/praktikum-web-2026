
document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

    const getTasks = () => {
        return JSON.parse(localStorage.getItem("todo_tasks")) || [];
    };

    const saveTasks = (tasks) => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    };

    const updateTaskCounter = (tasks) => {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const unfinished = total - completed;

        taskCounter.textContent =
            `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${unfinished}`;
    };

    const renderTasks = () => {
        const tasks = getTasks();

        todoList.innerHTML = "";
        updateTaskCounter(tasks);

        if (tasks.length === 0) {
            todoList.innerHTML = `
                <p style="text-align: center; color: #64748b; font-size: 13px; padding: 10px;">
                    Belum ada tugas tersimpan.
                </p>
            `;
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");

            li.className = `todo-item ${task.completed ? "completed" : ""}`;

            li.innerHTML = `
                <span class="todo-text"></span>

                <div class="todo-actions">
                    <button type="button" class="action-btn complete-btn" data-index="${index}">
                        ${task.completed ? "Batal" : "Selesai"}
                    </button>

                    <button type="button" class="action-btn delete-btn" data-index="${index}">
                        Hapus
                    </button>
                </div>
            `;

            li.querySelector(".todo-text").textContent = task.text;

            todoList.appendChild(li);
        });
    };

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const tasks = getTasks();

        if (tasks.length >= 5) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            inputError.textContent =
                "Kebanyakan atuh bro, 5 aja dulu okehh!";
            return;
        }

        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            inputError.textContent =
                "Tugas harus terdiri dari minimal 3 karakter.";
            return;
        }

        taskInput.classList.remove("error");
        inputError.style.display = "none";

        tasks.push({
            text: taskText,
            completed: false
        });

        saveTasks(tasks);

        taskInput.value = "";
        renderTasks();
    });

    todoList.addEventListener("click", (e) => {
        const button = e.target.closest("button[data-index]");

        if (!button) {
            return;
        }

        const index = Number(button.dataset.index);
        const tasks = getTasks();

        if (!Number.isInteger(index) || !tasks[index]) {
            return;
        }

        if (button.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;

            saveTasks(tasks);
            renderTasks();
        } else if (button.classList.contains("delete-btn")) {
            const konfirmasi = confirm(
                "Apakah Anda yakin ingin menghapus tugas ini?"
            );

            if (konfirmasi) {
                tasks.splice(index, 1);

                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    
    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();

        const unfinishedTasks = tasks.filter(
            task => !task.completed
        );

        const completedCount = tasks.length - unfinishedTasks.length;

        if (completedCount === 0) {
            alert("Tidak ada tugas selesai untuk dibersihkan.");
            return;
        }

        const konfirmasi = confirm(
            `Yakin ingin menghapus ${completedCount} tugas yang sudah selesai?\n\nPastikan kamu sudah merekap tugas yang diperlukan sebelum melanjutkan!`
        );

        if (konfirmasi) {
            saveTasks(unfinishedTasks);
            renderTasks();
            alert(`${completedCount} tugas selesai berhasil dibersihkan!`);
        }
    });

});
