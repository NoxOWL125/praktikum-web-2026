
 // File: script.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");

    // 2. Fungsi membaca dan menyimpan ke LocalStorage
    const getTasks = () => {
        return JSON.parse(localStorage.getItem("todo_tasks")) || [];
    };

    const saveTasks = (tasks) => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    };

    // 3. Fungsi menampilkan daftar tugas ke layar
    const renderTasks = () => {
        const tasks = getTasks();

        todoList.innerHTML = "";

        // Tampilkan pesan jika belum ada tugas
        if (tasks.length === 0) {
            todoList.innerHTML = `
                <p style="text-align: center; color: #64748b; font-size: 13px; padding: 10px;">
                    Belum ada tugas tersimpan.
                </p>
            `;
            return;
        }

        // Tampilkan setiap tugas
        tasks.forEach((task, index) => {
            const li = document.createElement("li");

            li.className = `todo-item ${task.completed ? "completed" : ""}`;

            li.innerHTML = `
                <span class="todo-text"></span>

                <div class="todo-actions">
                    <button
                        class="action-btn complete-btn"
                        data-index="${index}"
                    >
                        ${task.completed ? "Batal" : "Selesai"}
                    </button>

                    <button
                        class="action-btn delete-btn"
                        data-index="${index}"
                    >
                        Hapus
                    </button>
                </div>
            `;

            // Masukkan teks sebagai teks biasa agar input
            // pengguna tidak diperlakukan sebagai HTML
            li.querySelector(".todo-text").textContent = task.text;

            todoList.appendChild(li);
        });
    };

    // 4. Tambah tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();

        // Validasi input sederhana
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            inputError.textContent =
                "Tugas harus terdiri dari minimal 3 karakter.";
            return;
        }

        // Hilangkan pesan error jika input valid
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Simpan tugas baru ke LocalStorage
        const tasks = getTasks();

        tasks.push({
            text: taskText,
            completed: false
        });

        saveTasks(tasks);

        // Kosongkan input dan perbarui daftar tugas
        taskInput.value = "";
        renderTasks();
    });

    // 5. Tangani klik tombol Selesai dan Hapus
    // menggunakan Event Listener pada todoList
    todoList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;

        // Abaikan klik yang bukan tombol tugas
        if (index === undefined) {
            return;
        }

        const tasks = getTasks();

        // Tandai tugas selesai atau batalkan statusnya
        if (e.target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;

            saveTasks(tasks);
            renderTasks();
        }

        // Hapus tugas dari daftar
        else if (e.target.classList.contains("delete-btn")) {
            tasks.splice(index, 1);

            saveTasks(tasks);
            renderTasks();
        }
    });

    // 6. Render pertama kali saat halaman selesai dimuat
    renderTasks();
});
