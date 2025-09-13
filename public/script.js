class UserManager {
  constructor() {
    this.apiUrl = "/api/users";
    this.currentUserId = null;
    this.isEditing = false;

    this.initializeElements();
    this.attachEventListeners();
    this.loadUsers();
  }

  initializeElements() {
    this.form = document.getElementById("user-form");
    this.formTitle = document.getElementById("form-title");
    this.submitBtn = document.getElementById("submit-btn");
    this.cancelBtn = document.getElementById("cancel-btn");
    this.userIdInput = document.getElementById("user-id");
    this.usernameInput = document.getElementById("username");
    this.emailInput = document.getElementById("email");
    this.passwordInput = document.getElementById("password");
    this.usersTable = document.getElementById("users-table");
    this.usersTbody = document.getElementById("users-tbody");
    this.loading = document.getElementById("loading");
    this.errorMessage = document.getElementById("error-message");
    this.noUsers = document.getElementById("no-users");
    this.messageContainer = document.getElementById("message-container");
  }

  attachEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.cancelBtn.addEventListener("click", () => this.cancelEdit());
  }

  async handleSubmit(e) {
    e.preventDefault();

    const userData = {
      username: this.usernameInput.value.trim(),
      email: this.emailInput.value.trim(),
      password: this.passwordInput.value,
    };

    try {
      if (this.isEditing) {
        await this.updateUser(this.currentUserId, userData);
      } else {
        await this.createUser(userData);
      }
    } catch (error) {
      this.showMessage("An error occurred. Please try again.", "error");
    }
  }

  async createUser(userData) {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage("User created successfully!", "success");
        this.resetForm();
        this.loadUsers();
      } else {
        this.showMessage(result.message || "Failed to create user", "error");
      }
    } catch (error) {
      this.showMessage("Network error. Please try again.", "error");
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${this.apiUrl}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage("User updated successfully!", "success");
        this.cancelEdit();
        this.loadUsers();
      } else {
        this.showMessage(result.message || "Failed to update user", "error");
      }
    } catch (error) {
      this.showMessage("Network error. Please try again.", "error");
    }
  }

  async deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const response = await fetch(`${this.apiUrl}/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        this.showMessage("User deleted successfully!", "success");
        this.loadUsers();
      } else {
        this.showMessage(result.message || "Failed to delete user", "error");
      }
    } catch (error) {
      this.showMessage("Network error. Please try again.", "error");
    }
  }

  async loadUsers() {
    this.showLoading(true);
    this.hideError();

    try {
      const response = await fetch(this.apiUrl);
      const result = await response.json();

      if (result.success) {
        this.displayUsers(result.data);
      } else {
        this.showError("Failed to load users");
      }
    } catch (error) {
      this.showError("Network error. Please check your connection.");
    } finally {
      this.showLoading(false);
    }
  }

  displayUsers(users) {
    if (users.length === 0) {
      this.usersTable.style.display = "none";
      this.noUsers.style.display = "block";
      return;
    }

    this.noUsers.style.display = "none";
    this.usersTable.style.display = "table";

    this.usersTbody.innerHTML = users
      .map(
        (user) => `
            <tr>
                <td>${this.escapeHtml(user.username)}</td>
                <td>${this.escapeHtml(user.email)}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="action-btn edit-btn" onclick="userManager.editUser('${user._id}', '${this.escapeHtml(user.username)}', '${this.escapeHtml(user.email)}')">
                        Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="userManager.deleteUser('${user._id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `,
      )
      .join("");
  }

  editUser(userId, username, email) {
    this.isEditing = true;
    this.currentUserId = userId;

    this.formTitle.textContent = "Edit User";
    this.submitBtn.textContent = "Update User";
    this.cancelBtn.style.display = "inline-block";

    this.usernameInput.value = username;
    this.emailInput.value = email;
    this.passwordInput.value = "";
    this.passwordInput.placeholder = "Leave blank to keep current password";
    this.passwordInput.required = false;

    this.usernameInput.focus();
  }

  cancelEdit() {
    this.isEditing = false;
    this.currentUserId = null;

    this.formTitle.textContent = "Add New User";
    this.submitBtn.textContent = "Add User";
    this.cancelBtn.style.display = "none";

    this.passwordInput.placeholder = "";
    this.passwordInput.required = true;

    this.resetForm();
  }

  resetForm() {
    this.form.reset();
    this.userIdInput.value = "";
  }

  showMessage(message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    this.messageContainer.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  showLoading(show) {
    this.loading.style.display = show ? "block" : "none";
  }

  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = "block";
  }

  hideError() {
    this.errorMessage.style.display = "none";
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the application
const userManager = new UserManager();
