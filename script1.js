const API_URL = "http://localhost:5000/reviews"; // Backend URL

// Fetch and display reviews
async function fetchReviews() {
    const res = await fetch(API_URL);
    const reviews = await res.json();
    const reviewsDiv = document.getElementById('reviews');
    reviewsDiv.innerHTML = "";
    reviews.forEach(review => {
        const reviewEl = document.createElement('div');
        reviewEl.classList.add('review');
        reviewEl.innerHTML = `
            <h3>${review.movieName} (Rating: ${review.rating})</h3>
            <p><strong>By:</strong> ${review.reviewer}</p>
            <p>${review.comment}</p>
            <button class="delete-btn" onclick="deleteReview('${review._id}')">Delete</button>
            <button class="update-btn" onclick="updateReview('${review._id}')">Update</button>
        `;
        reviewsDiv.appendChild(reviewEl);
    });
}

// Add a new review
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const movieName = document.getElementById("movieName").value;
    const reviewer = document.getElementById("reviewer").value;
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieName, reviewer, rating, comment })
    });

    fetchReviews(); // Refresh reviews
    e.target.reset(); // Clear form

    // 🚀 Scroll to the form to make sure it's visible
    setTimeout(() => {
        document.getElementById("reviewForm").scrollIntoView({ behavior: "smooth" });
    }, 100);
});

// Delete a review
async function deleteReview(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchReviews();
}

// Update a review
async function updateReview(id) {
    const newRating = prompt("Enter new rating:");
    const newComment = prompt("Enter new comment:");

    if (newRating && newComment) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: newRating, comment: newComment })
        });
        fetchReviews();
    }
}

// 🚀 Force scroll to the top on page load
window.onload = function() {
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
};

// Load reviews on page load
fetchReviews();