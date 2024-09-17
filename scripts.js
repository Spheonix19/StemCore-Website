document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('booking-form');
  const submitButton = document.getElementById('submit-button');
  const subjectsContainer = document.getElementById('subjects-container');

  // Input fields and status icons
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const levelInput = document.querySelector('select[name="level"]');
  const messageInput = document.querySelector('textarea[name="message"]');
  const subjectDropdown = document.getElementById('subject-dropdown');
  const subjectSelect = document.getElementById('subject');

  // Flags to track if user has interacted with fields
  let levelInteracted = false;
  let subjectInteracted = false;

  // List to track selected subjects
  let selectedSubjects = [];

  // Event listeners for real-time validation
  nameInput.addEventListener('input', validateField);
  emailInput.addEventListener('input', validateField);
  phoneInput.addEventListener('input', validateField);
  levelInput.addEventListener('change', function() {
    levelInteracted = true;
    handleLevelChange();
    validateField(); // Revalidate form when level changes
  });
  subjectsContainer.addEventListener('change', function(event) {
    if (event.target.tagName === 'SELECT') {
      subjectInteracted = true;
      handleSubjectChange(event.target);
      validateField(); // Revalidate form when subject changes
    }
  });
  messageInput.addEventListener('input', validateField);

  // Function to validate all fields and update submit button state
  function validateField() {
    const isValid = isFormValid();
    submitButton.disabled = !isValid;
  }

  // Function to validate all fields
  function isFormValid() {
    clearStatusIcons();

    let isValid = true;

    // Validate name
    if (!nameInput.value.trim()) {
      showStatusIcon(nameInput, 'invalid');
      isValid = false;
    } else {
      showStatusIcon(nameInput, 'valid');
    }

    // Validate email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      showStatusIcon(emailInput, 'invalid');
      isValid = false;
    } else {
      showStatusIcon(emailInput, 'valid');
    }

    // Validate phone number
    if (!phoneInput.value.trim() || !validatePhone(phoneInput.value.trim())) {
      showStatusIcon(phoneInput, 'invalid');
      isValid = false;
    } else {
      showStatusIcon(phoneInput, 'valid');
    }

    // Validate level
    if (!levelInteracted || !levelInput.value) {
      showStatusIcon(levelInput, 'optional'); // No error for unfilled level if not interacted
    } else if (!levelInput.value) {
      showStatusIcon(levelInput, 'invalid');
      isValid = false;
    } else {
      showStatusIcon(levelInput, 'valid');
    }

    // Validate all subject dropdowns except the most recent one
    const subjectSelects = document.querySelectorAll('#subjects-container select');
    const latestSubjectSelect = subjectSelects[subjectSelects.length - 1];

    subjectSelects.forEach((select, index) => {
      if (select !== latestSubjectSelect) {
        if (!select.value) {
          showStatusIcon(select, 'invalid');
          isValid = false;
        } else {
          showStatusIcon(select, 'valid');
        }
      }
    });

    // Validate the latest subject dropdown
    if (!subjectInteracted || !latestSubjectSelect.value) {
      showStatusIcon(latestSubjectSelect, 'optional'); // No error for unfilled latest subject if not interacted
    } else {
      showStatusIcon(latestSubjectSelect, 'valid');
    }

    return isValid;
  }

  // Function to validate email
  function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  // Function to validate phone number
  function validatePhone(phone) {
    const phonePattern = /^07\d{9}$/;
    return phonePattern.test(phone);
  }

  // Function to clear all status icons
  function clearStatusIcons() {
    document.querySelectorAll('.status-icon').forEach(icon => {
      icon.style.display = 'none';
      icon.classList.remove('valid', 'invalid', 'optional');
      icon.textContent = ''; // Clear any existing text
    });
  }

  // Function to show status icon
  function showStatusIcon(element, status) {
    const icon = element.parentElement.querySelector('.status-icon');
    if (icon) {
      icon.style.display = 'inline';
      icon.classList.add(status);
      icon.textContent = status === 'valid' ? '✔' : status === 'invalid' ? '✘' : '';
    }
  }

  // Handle level change and update subject dropdown
  function handleLevelChange() {
    const level = levelInput.value;
    let subjects = [];

    switch (level) {
      case '11+':
        subjects = ['Mathematics', 'English', 'Verbal Reasoning', 'Non-Verbal Reasoning'];
        break;
      case 'Year 7 to Year 9':
        subjects = ['Mathematics', 'Computer Science', 'Sciences'];
        break;
      case 'GCSE':
        subjects = ['Mathematics', 'Further Mathematics','Physics', 'Chemistry', 'Biology', 'Computer Science'];
        break;
      case 'A-level':
        subjects = ['Mathematics', 'Further Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics'];
        break;
      default:
        subjects = [];
    }

    if (subjects.length > 0) {
      // Reset the selected subjects list
      selectedSubjects = [];

      // Show the subject dropdown container
      subjectsContainer.style.display = 'block';
      updateSubjectDropdown(subjects);
    } else {
      // Hide the subject dropdown container if no subjects are available
      subjectsContainer.style.display = 'none';
      clearSubjectDropdowns();
    }
  }

  // Handle subject change and add new dropdown if needed
  function handleSubjectChange(target) {
    if (target.value) {
      // Update the selected subjects list
      updateSelectedSubjects();

      // Only add a new subject dropdown if there is no new one
      const subjectSelects = document.querySelectorAll('#subjects-container select');
      if (subjectSelects[subjectSelects.length - 1] === target) {
        addSubjectDropdown();
      }
    }
  }

  // Update selected subjects list based on the current dropdown values
  function updateSelectedSubjects() {
    selectedSubjects = [];
    const subjectSelects = document.querySelectorAll('#subjects-container select');
    subjectSelects.forEach(select => {
      if (select.value) {
        selectedSubjects.push(select.value);
      }
    });
  }

  // Update subject dropdown options
  function updateSubjectDropdown(subjects) {
    // Clear existing dropdowns except the first one
    clearSubjectDropdowns();

    // Filter subjects to exclude those already selected
    const availableSubjects = subjects.filter(subject => !selectedSubjects.includes(subject));

    // Update the initial dropdown
    subjectSelect.innerHTML = '<option value="">Select Subject</option>'; // Reset options
    availableSubjects.forEach(subject => {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      subjectSelect.appendChild(option);
    });

    // Ensure the initial dropdown is visible
    subjectDropdown.style.display = 'block';
  }

  // Clear existing subject dropdowns except the initial one
  function clearSubjectDropdowns() {
    const existingDropdowns = document.querySelectorAll('#subjects-container .subject-dropdown');
    existingDropdowns.forEach((dropdown, index) => {
      if (index > 0) { // Skip the first dropdown
        dropdown.remove();
      }
    });
  }

  // Add new subject dropdown
  function addSubjectDropdown() {
    const newDropdown = document.createElement('div');
    newDropdown.classList.add('form-group', 'subject-dropdown');

    const newLabel = document.createElement('label');
    newLabel.textContent = 'Subject:';
    newDropdown.appendChild(newLabel);

    const newSelect = document.createElement('select');
    newSelect.name = 'subject';
    newSelect.innerHTML = '<option value="">Select Subject</option>'; // Reset options

    // Exclude selected subjects from new dropdown
    const availableSubjects = Array.from(subjectSelect.querySelectorAll('option')).map(option => option.value).filter(value => value && !selectedSubjects.includes(value));
    availableSubjects.forEach(subject => {
      const newOption = document.createElement('option');
      newOption.value = subject;
      newOption.textContent = subject;
      newSelect.appendChild(newOption);
    });
    newDropdown.appendChild(newSelect);

    const newStatusIcon = document.createElement('span');
    newStatusIcon.classList.add('status-icon');
    newDropdown.appendChild(newStatusIcon);

    subjectsContainer.appendChild(newDropdown);

    newSelect.addEventListener('change', function() {
      handleSubjectChange(newSelect);
      validateField(); // Revalidate form when a new dropdown is added
    });
  }
});
