/**
 * User Management System - Frontend JavaScript
 * Handles all client-side functionality including form submission,
 * user display, editing, deletion, and API communication
 */

class UserManager {
  /**
   * Initialize the UserManager with DOM elements and event listeners
   */
  constructor() {
    this.apiUrl = "/api/users";
    this.currentUserId = null; // Stores ID of user being edited
    this.isEditing = false; // Tracks if we're in edit mode

    this.initializeElements();
    this.attachEventListeners();
    this.loadUsers();
  }

  /**
   * Get references to all DOM elements we'll need
   */
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

  /**
   * Attach event listeners to form elements
   */
  attachEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.cancelBtn.addEventListener("click", () => this.cancelEdit());
  }

  /**
   * Handle form submission for both create and update operations
   * @param {Event} e - Form submit event
   */
  async handleSubmit(e) {
    e.preventDefault();

    // Extract form data
    const userData = {
      username: this.usernameInput.value.trim(),
      email: this.emailInput.value.trim(),
      password: this.passwordInput.value,
    };

    try {
      // Determine if we're creating or updating
      if (this.isEditing) {
        await this.updateUser(this.currentUserId, userData);
      } else {
        await this.createUser(userData);
      }
    } catch (error) {
      this.showMessage("An error occurred. Please try again.", "error");
    }
  }

  /**
   * Create a new user via API
   * @param {Object} userData - User data from form
   */
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
        this.loadUsers(); // Refresh the user list
      } else {
        this.showMessage(result.message || "Failed to create user", "error");
      }
    } catch (error) {
      this.showMessage("Network error. Please try again.", "error");
    }
  }

  /**
   * Update an existing user via API
   * @param {string} userId - ID of user to update
   * @param {Object} userData - Updated user data
   */
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
        this.loadUsers(); // Refresh the user list
      } else {
        this.showMessage(result.message || "Failed to update user", "error");
      }
    } catch (error) {
      this.showMessage("Network error. Please try again.", "error");
    }
  }

  /**
   * Delete a user via API with confirmation
   * @param {string} userId - ID of user to delete
   */
  async deleteUser(userId) {
    // Show confirmation dialog
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
        this.loadUsers(); // Refresh the user list
      } else {
        this.showMessage(result.message || "Failed to delete user", "error");
      }
    } catch (error) {
      this.showMessage("Network error. Please try again.", "error");
    }
  }

  /**
   * Load all users from API and display them
   */
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

  /**
   * Display users in the table or show "no users" message
   * @param {Array} users - Array of user objects
   */
  displayUsers(users) {
    if (users.length === 0) {
      this.usersTable.style.display = "none";
      this.noUsers.style.display = "block";
      return;
    }

    this.noUsers.style.display = "none";
    this.usersTable.style.display = "table";

    // Generate table rows for each user
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

  /**
   * Switch to edit mode and populate form with user data
   * @param {string} userId - ID of user to edit
   * @param {string} username - Current username
   * @param {string} email - Current email
   */
  editUser(userId, username, email) {
    this.isEditing = true;
    this.currentUserId = userId;

    // Update form UI for editing
    this.formTitle.textContent = "Edit User";
    this.submitBtn.textContent = "Update User";
    this.cancelBtn.style.display = "inline-block";

    // Populate form with current user data
    this.usernameInput.value = username;
    this.emailInput.value = email;
    this.passwordInput.value = "";
    this.passwordInput.placeholder = "Leave blank to keep current password";
    this.passwordInput.required = false; // Password optional for updates

    this.usernameInput.focus();
  }

  /**
   * Cancel edit mode and return to create mode
   */
  cancelEdit() {
    this.isEditing = false;
    this.currentUserId = null;

    // Reset form UI to create mode
    this.formTitle.textContent = "Add New User";
    this.submitBtn.textContent = "Add User";
    this.cancelBtn.style.display = "none";

    // Reset password field requirements
    this.passwordInput.placeholder = "";
    this.passwordInput.required = true;

    this.resetForm();
  }

  /**
   * Clear all form fields
   */
  resetForm() {
    this.form.reset();
    this.userIdInput.value = "";
  }

  /**
   * Show a temporary message to the user
   * @param {string} message - Message text
   * @param {string} type - Message type ('success' or 'error')
   */
  showMessage(message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    this.messageContainer.appendChild(messageDiv);

    // Auto-remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }

  /**
   * Show or hide loading indicator
   * @param {boolean} show - Whether to show loading
   */
  showLoading(show) {
    this.loading.style.display = show ? "block" : "none";
  }

  /**
   * Show error message
   * @param {string} message - Error message text
   */
  showError(message) {
    this.errorMessage.textContent = message;
    this.errorMessage.style.display = "block";
  }

  /**
   * Hide error message
   */
  hideError() {
    this.errorMessage.style.display = "none";
  }

  /**
   * Escape HTML to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} - HTML-escaped text
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the application when page loads
const userManager = new UserManager();
