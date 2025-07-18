// Dashboard JavaScript for BuckeyeRide
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// Initialize dashboard functionality
function initializeDashboard() {
    checkAuthentication();
    loadUserData();
    setupDashboardForms();
    setupProgressTracking();
    setupTabSwitching();
    initializePageSpecificFeatures();
}

// Check if user is authenticated
function checkAuthentication() {
    const user = getCurrentUser();
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '../login.html?return=' + encodeURIComponent(window.location.href);
        return;
    }
    updateDashboardUI(user);
}

// Load user data into forms
function loadUserData() {
    const user = getCurrentUser();
    if (!user) return;

    // Load basic user info
    const fields = ['firstName', 'lastName', 'email', 'phone'];
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element && user[field]) {
            element.value = user[field];
            if (field === 'email') {
                element.readOnly = true;
            }
        }
    });

    // Load profile data if it exists
    const profileData = getProfileData();
    if (profileData) {
        loadProfileData(profileData);
    }
}

// Setup dashboard forms
function setupDashboardForms() {
    const profileForm = document.getElementById('profileForm');
    const scheduleForm = document.getElementById('scheduleForm');
    const filtersForm = document.getElementById('filtersForm');
    const groupForm = document.getElementById('groupForm');

    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
        setupProfileValidation();
    }

    if (scheduleForm) {
        scheduleForm.addEventListener('submit', handleScheduleSubmit);
    }

    if (filtersForm) {
        filtersForm.addEventListener('submit', handleFiltersSubmit);
    }

    if (groupForm) {
        groupForm.addEventListener('submit', handleGroupSubmit);
    }
}

// Setup progress tracking for profile completion
function setupProgressTracking() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    const requiredFields = profileForm.querySelectorAll('[required]');
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');

    function updateProgress() {
        let completedFields = 0;
        let totalFields = requiredFields.length;

        requiredFields.forEach(field => {
            if (field.type === 'radio') {
                const radioGroup = profileForm.querySelectorAll(`[name="${field.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (isChecked) completedFields++;
            } else if (field.value.trim()) {
                completedFields++;
            }
        });

        // Remove duplicates for radio groups
        const radioGroups = new Set();
        requiredFields.forEach(field => {
            if (field.type === 'radio') {
                radioGroups.add(field.name);
            }
        });
        
        totalFields = requiredFields.length - radioGroups.size + radioGroups.size;
        const percentage = Math.round((completedFields / totalFields) * 100);

        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        if (progressPercentage) {
            progressPercentage.textContent = percentage + '%';
        }

        // Update user profile completion status
        const user = getCurrentUser();
        if (user) {
            user.profileComplete = percentage === 100;
            saveUserData(user);
        }
    }

    // Add event listeners to all form fields
    requiredFields.forEach(field => {
        field.addEventListener('input', updateProgress);
        field.addEventListener('change', updateProgress);
    });

    // Initial progress calculation
    updateProgress();
}

// Handle profile form submission
function handleProfileSubmit(event) {
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
        const profileData = {};

        // Collect all form data
        for (let [key, value] of formData.entries()) {
            profileData[key] = value;
        }

        // Save profile data
        saveProfileData(profileData);

        // Update user data
        const user = getCurrentUser();
        if (user) {
            user.firstName = profileData.firstName;
            user.lastName = profileData.lastName;
            user.phone = profileData.phone;
            user.profileComplete = true;
            saveUserData(user);
        }

        showSuccessMessage('Profile saved successfully!');

        // Redirect to schedules if profile is complete
        setTimeout(() => {
            window.location.href = 'schedules.html';
        }, 1500);

    } catch (error) {
        console.error('Profile save error:', error);
        showErrorMessage('Failed to save profile. Please try again.');
    }
}

// Handle schedule form submission
function handleScheduleSubmit(event) {
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
        const scheduleData = {
            id: Date.now().toString(),
            day: formData.get('day'),
            startLocation: formData.get('startLocation'),
            endLocation: formData.get('endLocation'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            recurring: formData.get('recurring') === 'on',
            notes: formData.get('notes') || ''
        };

        // Validate schedule data
        if (!scheduleData.day || !scheduleData.startLocation || !scheduleData.endLocation || 
            !scheduleData.startTime || !scheduleData.endTime) {
            showErrorMessage('Please fill in all required fields.');
            return;
        }

        // Save schedule
        saveSchedule(scheduleData);
        
        // Reset form
        event.target.reset();
        
        // Refresh schedule list
        loadSchedules();
        
        showSuccessMessage('Schedule added successfully!');

    } catch (error) {
        console.error('Schedule save error:', error);
        showErrorMessage('Failed to save schedule. Please try again.');
    }
}

// Handle filters form submission
function handleFiltersSubmit(event) {
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
        const filters = {
            startLocationRadius: formData.get('startLocationRadius') || 5,
            endLocationRadius: formData.get('endLocationRadius') || 5,
            timeWindow: formData.get('timeWindow') || 30,
            smokingPreference: formData.get('smokingPreference'),
            musicPreference: formData.get('musicPreference'),
            talkativeLevel: formData.get('talkativeLevel'),
            petsPolicy: formData.get('petsPolicy')
        };

        // Apply filters and show matches
        const matches = findMatches(filters);
        displayMatches(matches);

    } catch (error) {
        console.error('Filter error:', error);
        showErrorMessage('Failed to apply filters. Please try again.');
    }
}

// Handle group form submission
function handleGroupSubmit(event) {
    event.preventDefault();

    try {
        const formData = new FormData(event.target);
        const groupData = {
            id: Date.now().toString(),
            name: formData.get('groupName'),
            description: formData.get('groupDescription'),
            privacy: formData.get('privacy') || 'public',
            members: [getCurrentUser().email], // Creator is first member
            createdAt: new Date().toISOString(),
            createdBy: getCurrentUser().email
        };

        // Validate group data
        if (!groupData.name.trim()) {
            showErrorMessage('Group name is required.');
            return;
        }

        // Save group
        saveGroup(groupData);
        
        // Reset form
        event.target.reset();
        
        // Refresh groups list
        loadGroups();
        
        showSuccessMessage('Group created successfully!');

    } catch (error) {
        console.error('Group creation error:', error);
        showErrorMessage('Failed to create group. Please try again.');
    }
}

// Setup tab switching functionality
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Initialize page-specific features
function initializePageSpecificFeatures() {
    const currentPage = window.location.pathname.split('/').pop();

    switch (currentPage) {
        case 'profile.html':
            initializeProfilePage();
            break;
        case 'schedules.html':
            initializeSchedulesPage();
            break;
        case 'findmatches.html':
            initializeFindMatchesPage();
            break;
        case 'groups.html':
            initializeGroupsPage();
            break;
        case 'buddies.html':
            initializeBuddiesPage();
            break;
        case 'ride.html':
            initializeRidePage();
            break;
    }
}

// Page-specific initialization functions
function initializeProfilePage() {
    // Profile page is already initialized in setupProgressTracking
}

function initializeSchedulesPage() {
    loadSchedules();
}

function initializeFindMatchesPage() {
    // Load search parameters from URL if any
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pickup')) {
        const pickupField = document.getElementById('startLocation');
        if (pickupField) pickupField.value = urlParams.get('pickup');
    }
    if (urlParams.get('dropoff')) {
        const dropoffField = document.getElementById('endLocation');
        if (dropoffField) dropoffField.value = urlParams.get('dropoff');
    }
    
    // Load initial matches
    loadInitialMatches();
}

function initializeGroupsPage() {
    loadGroups();
}

function initializeBuddiesPage() {
    loadBuddies();
}

function initializeRidePage() {
    setupRideActions();
    setupRating();
}

// Data management functions
function saveProfileData(data) {
    try {
        localStorage.setItem('buckeyeride_profile', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving profile data:', error);
        throw error;
    }
}

function getProfileData() {
    try {
        const data = localStorage.getItem('buckeyeride_profile');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading profile data:', error);
        return null;
    }
}

function loadProfileData(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
        if (element) {
            if (element.type === 'radio') {
                const radioButton = document.querySelector(`[name="${key}"][value="${data[key]}"]`);
                if (radioButton) radioButton.checked = true;
            } else if (element.type === 'checkbox') {
                element.checked = data[key] === 'on' || data[key] === true;
            } else {
                element.value = data[key];
            }
        }
    });
}

function saveSchedule(schedule) {
    try {
        const schedules = getSchedules();
        schedules.push(schedule);
        localStorage.setItem('buckeyeride_schedules', JSON.stringify(schedules));
    } catch (error) {
        console.error('Error saving schedule:', error);
        throw error;
    }
}

function getSchedules() {
    try {
        const data = localStorage.getItem('buckeyeride_schedules');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading schedules:', error);
        return [];
    }
}

function loadSchedules() {
    const schedulesList = document.getElementById('schedulesList');
    if (!schedulesList) return;

    const schedules = getSchedules();
    
    if (schedules.length === 0) {
        schedulesList.innerHTML = '<p class="no-data">No schedules added yet. Create your first schedule!</p>';
        return;
    }

    schedulesList.innerHTML = schedules.map(schedule => `
        <div class="schedule-item">
            <h4>${schedule.day} - ${schedule.startTime} to ${schedule.endTime}</h4>
            <p><strong>From:</strong> ${schedule.startLocation}</p>
            <p><strong>To:</strong> ${schedule.endLocation}</p>
            ${schedule.notes ? `<p><strong>Notes:</strong> ${schedule.notes}</p>` : ''}
            <div class="schedule-actions">
                <button class="btn btn-small btn-secondary" onclick="editSchedule('${schedule.id}')">Edit</button>
                <button class="btn btn-small btn-primary" onclick="deleteSchedule('${schedule.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteSchedule(scheduleId) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        try {
            const schedules = getSchedules().filter(s => s.id !== scheduleId);
            localStorage.setItem('buckeyeride_schedules', JSON.stringify(schedules));
            loadSchedules();
            showSuccessMessage('Schedule deleted successfully!');
        } catch (error) {
            console.error('Error deleting schedule:', error);
            showErrorMessage('Failed to delete schedule.');
        }
    }
}

function findMatches(filters) {
    // Simulate finding matches based on filters
    // In a real app, this would call an API
    const sampleMatches = [
        {
            id: '1',
            name: 'Sarah Johnson',
            compatibility: '95%',
            startLocation: 'Campus Area',
            endLocation: 'Downtown Columbus',
            time: '8:00 AM',
            musicPreference: 'Pop',
            smokingPolicy: 'No Smoking',
            talkativeLevel: 'Moderate',
            petsPolicy: 'No Pets'
        },
        {
            id: '2',
            name: 'Mike Chen',
            compatibility: '87%',
            startLocation: 'North Campus',
            endLocation: 'Easton',
            time: '8:15 AM',
            musicPreference: 'Any',
            smokingPolicy: 'No Smoking',
            talkativeLevel: 'Chatty',
            petsPolicy: 'Pets OK'
        }
    ];

    // Apply basic filtering (in a real app, this would be more sophisticated)
    return sampleMatches.filter(match => {
        if (filters.smokingPreference && match.smokingPolicy !== filters.smokingPreference) {
            return false;
        }
        if (filters.musicPreference && match.musicPreference !== filters.musicPreference && match.musicPreference !== 'Any') {
            return false;
        }
        if (filters.talkativeLevel && match.talkativeLevel !== filters.talkativeLevel) {
            return false;
        }
        return true;
    });
}

function displayMatches(matches) {
    const matchesContainer = document.getElementById('matchesContainer');
    if (!matchesContainer) return;

    if (matches.length === 0) {
        matchesContainer.innerHTML = '<p class="no-data">No matches found with your current filters. Try adjusting your preferences.</p>';
        return;
    }

    matchesContainer.innerHTML = matches.map(match => `
        <div class="match-item">
            <div class="match-header">
                <h3 class="match-name">${match.name}</h3>
                <span class="match-compatibility">${match.compatibility} Match</span>
            </div>
            <div class="match-details">
                <div class="match-detail"><strong>Route:</strong> ${match.startLocation} → ${match.endLocation}</div>
                <div class="match-detail"><strong>Time:</strong> ${match.time}</div>
                <div class="match-detail"><strong>Music:</strong> ${match.musicPreference}</div>
                <div class="match-detail"><strong>Smoking:</strong> ${match.smokingPolicy}</div>
                <div class="match-detail"><strong>Talking:</strong> ${match.talkativeLevel}</div>
                <div class="match-detail"><strong>Pets:</strong> ${match.petsPolicy}</div>
            </div>
            <div class="match-actions">
                <button class="btn btn-primary btn-small" onclick="contactMatch('${match.id}')">Contact</button>
                <button class="btn btn-secondary btn-small" onclick="viewProfile('${match.id}')">View Profile</button>
            </div>
        </div>
    `).join('');
}

function loadInitialMatches() {
    // Load some initial matches
    const defaultFilters = {};
    const matches = findMatches(defaultFilters);
    displayMatches(matches);
}

// Utility functions
function getCurrentUser() {
    if (window.BuckeyeRideAuth && window.BuckeyeRideAuth.getCurrentUser) {
        return window.BuckeyeRideAuth.getCurrentUser();
    }
    
    try {
        const userData = localStorage.getItem('buckeyeride_user') || 
                        sessionStorage.getItem('buckeyeride_user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

function saveUserData(userData) {
    try {
        localStorage.setItem('buckeyeride_user', JSON.stringify(userData));
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

function updateDashboardUI(user) {
    // Update welcome message
    const welcomeElements = document.querySelectorAll('.welcome-user');
    welcomeElements.forEach(element => {
        element.textContent = `Welcome, ${user.firstName || user.name}!`;
    });
}

function skipProfile() {
    if (confirm('Are you sure you want to skip profile completion? You can complete it later from the dashboard.')) {
        window.location.href = 'schedules.html';
    }
}

// Placeholder functions for features to be implemented
function contactMatch(matchId) {
    showNotification('Contact feature coming soon!', 'info');
}

function viewProfile(profileId) {
    showNotification('Profile viewing feature coming soon!', 'info');
}

function editSchedule(scheduleId) {
    showNotification('Schedule editing feature coming soon!', 'info');
}

function saveGroup(groupData) {
    try {
        const groups = getGroups();
        groups.push(groupData);
        localStorage.setItem('buckeyeride_groups', JSON.stringify(groups));
    } catch (error) {
        console.error('Error saving group:', error);
        throw error;
    }
}

function getGroups() {
    try {
        const data = localStorage.getItem('buckeyeride_groups');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading groups:', error);
        return [];
    }
}

function loadGroups() {
    const groupsList = document.getElementById('groupsList');
    if (!groupsList) return;

    const groups = getGroups();
    
    if (groups.length === 0) {
        groupsList.innerHTML = '<p class="no-data">No groups yet. Create your first group!</p>';
        return;
    }

    groupsList.innerHTML = groups.map(group => `
        <div class="group-card">
            <div class="group-header">
                <h3 class="group-name">${group.name}</h3>
                <span class="group-members">${group.members.length} members</span>
            </div>
            <p class="group-description">${group.description || 'No description provided.'}</p>
            <div class="group-actions">
                <button class="btn btn-primary btn-small" onclick="viewGroup('${group.id}')">View</button>
                <button class="btn btn-secondary btn-small" onclick="shareScheduleWithGroup('${group.id}')">Share Schedule</button>
            </div>
        </div>
    `).join('');
}

function loadBuddies() {
    // Placeholder for buddies functionality
    const buddiesList = document.getElementById('buddiesList');
    if (buddiesList) {
        buddiesList.innerHTML = '<p class="no-data">No carpooling buddies yet. Complete some rides to start building your network!</p>';
    }
}

function setupRideActions() {
    // Placeholder for ride actions
}

function setupRating() {
    // Placeholder for rating system
}

// Error handling functions
function showErrorMessage(message) {
    if (window.BuckeyeRide && window.BuckeyeRide.showErrorMessage) {
        window.BuckeyeRide.showErrorMessage(message);
    } else {
        alert(message);
    }
}

function showSuccessMessage(message) {
    if (window.BuckeyeRide && window.BuckeyeRide.showSuccessMessage) {
        window.BuckeyeRide.showSuccessMessage(message);
    } else {
        alert(message);
    }
}

function showNotification(message, type) {
    if (window.BuckeyeRide && window.BuckeyeRide.showNotification) {
        window.BuckeyeRide.showNotification(message, type);
    } else {
        alert(message);
    }
}

function logout() {
    if (window.BuckeyeRideAuth && window.BuckeyeRideAuth.logout) {
        window.BuckeyeRideAuth.logout();
    } else {
        localStorage.removeItem('buckeyeride_user');
        sessionStorage.removeItem('buckeyeride_user');
        window.location.href = '../index.html';
    }
}

// Export functions for global use
window.BuckeyeRideDashboard = {
    skipProfile,
    deleteSchedule,
    editSchedule,
    contactMatch,
    viewProfile,
    logout
};
