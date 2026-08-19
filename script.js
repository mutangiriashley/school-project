// Mock Data for Available Surplus Food Listings
const mockListings = [
  {
    id: 1,
    donor: "Kalingalinga Fresh Bakery",
    title: "Surplus Bread & Scones",
    location: "Lusaka (Kalingalinga)",
    zip: "10101",
    quantity: "25 Meal Packs",
    pickupTime: "Pickup before 18:00",
    tags: ["Vegetarian", "Dairy-Free"]
  },
  {
    id: 2,
    donor: "Copperbelt Farm Produce",
    title: "Fresh Maize & Leafy Vegetables",
    location: "Ndola (Central)",
    zip: "20100",
    quantity: "10 Bulk Crates",
    pickupTime: "Pickup before 17:00",
    tags: ["Vegan", "Gluten-Free"]
  }
];
// DOM Elements
const zipInput = document.getElementById('zipInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('resultsGrid');
const resultsCount = document.getElementById('resultsCount');
const filterChips = document.querySelectorAll('.filter-chip');
const toast = document.getElementById('toast');

// Modal DOM Elements
const donorModal = document.getElementById('donorModal');
const openModalBtns = document.querySelectorAll('.open-modal-btn');
const closeModalBtn = document.getElementById('closeModalBtn');
const donorForm = document.getElementById('donorForm');

// Helper: Show notification toast
function showToast(message) {
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 4500);
}

// Modal Handlers
function openModal() {
  donorModal.classList.add('active');
  donorModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeModal() {
  donorModal.classList.remove('active');
  donorModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto'; // Restore background scroll
}

// Event Listeners for Modal
openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside content box
donorModal.addEventListener('click', (e) => {
  if (e.target === donorModal) {
    closeModal();
  }
});

// Close modal on 'Escape' keypress
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && donorModal.classList.contains('active')) {
    closeModal();
  }
});

// Handle Donor Registration Form Submission
donorForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const businessName = document.getElementById('businessName').value.trim();
  const contactName = document.getElementById('contactName').value.trim();

  closeModal();
  donorForm.reset();

  showToast(`🎉 Welcome aboard, ${businessName}! Our onboarding coordinator will reach out to ${contactName} shortly.`);
});

// Toggle active state for dietary filter chips
filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('active');
    filterListings();
  });
});

// Render cards dynamically to DOM
function renderListings(items) {
  resultsGrid.innerHTML = '';

  if (items.length === 0) {
    resultsGrid.innerHTML = `
      <div class="no-results">
        <h3>No matching food listings found</h3>
        <p>Try clearing your dietary filters or searching a different zip code.</p>
      </div>
    `;
    resultsCount.textContent = '0 listings found';
    return;
  }

  resultsCount.textContent = `Showing ${items.length} active rescue listing${items.length > 1 ? 's' : ''}`;

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'listing-card';

    const tagsHTML = item.tags
      .map(tag => `<span class="item-tag">${tag}</span>`)
      .join('');

    card.innerHTML = `
      <div>
        <div class="listing-header">
          <span class="donor-name">${item.donor}</span>
        </div>
        <div class="listing-title">${item.title}</div>
        <div class="listing-meta">
          📍 ${item.location}<br>
          📦 ${item.quantity} • ⏰ ${item.pickupTime}
        </div>
        <div class="tag-list">${tagsHTML}</div>
      </div>
      <button class="btn claim-btn" onclick="claimMeal('${item.donor}')">Reserve Meal</button>
    `;

    resultsGrid.appendChild(card);
  });
}

// Filter Logic based on Zip/City and selected chips
function filterListings() {
  const searchTerm = zipInput.value.trim().toLowerCase();
  
  const selectedTags = Array.from(document.querySelectorAll('.filter-chip.active'))
                            .map(chip => chip.dataset.filter);

  const filtered = mockListings.filter(item => {
    const matchesLocation = !searchTerm || 
                            item.location.toLowerCase().includes(searchTerm) || 
                            item.zip.includes(searchTerm);

    const matchesTags = selectedTags.every(tag => item.tags.includes(tag));

    return matchesLocation && matchesTags;
  });

  renderListings(filtered);
}

// Global Reserve Action handler
window.claimMeal = function(donorName) {
  showToast(`Reservation request sent to ${donorName}! Check your email for pickup instructions.`);
};

// Search Listeners
searchBtn.addEventListener('click', () => {
  filterListings();
  showToast('Updating local food listings...');
});

zipInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') filterListings();
});

// Initial Render
renderListings(mockListings);
