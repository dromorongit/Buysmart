// Follow JavaScript File
console.log("BuySmart Enterprise Follow System");

// Follow Functions
function followBuySmart() {
    // Retrieve the current follower count from LocalStorage
    let followerCount = parseInt(localStorage.getItem('followerCount')) || 0;
    
    // Check if the user has already followed
    const hasFollowed = localStorage.getItem('hasFollowed') === 'true';
    
    if (!hasFollowed) {
        // If the user has not followed, increment the follower count
        followerCount += 1;
        
        // Save the updated follower count to LocalStorage
        localStorage.setItem('followerCount', followerCount.toString());
        
        // Mark that the user has followed
        localStorage.setItem('hasFollowed', 'true');
        
        // Update the follower count in the UI
        updateFollowerCount();
        
        console.log(`User followed BuySmart. Total followers: ${followerCount}`);
    } else {
        console.log("User has already followed BuySmart.");
    }
}

// Update the follower count in the UI
function updateFollowerCount() {
    const followerCount = parseInt(localStorage.getItem('followerCount')) || 0;
    
    const followerCountElement = document.getElementById('follower-count');
    if (followerCountElement) {
        followerCountElement.textContent = followerCount;
    }
    
    const followerCountHeader = document.getElementById('follower-count-header');
    if (followerCountHeader) {
        followerCountHeader.textContent = followerCount;
    }
    
    const followerCountFooter = document.getElementById('follower-count-footer');
    if (followerCountFooter) {
        followerCountFooter.textContent = followerCount;
    }
}

// Initialize the follow system
function initFollow() {
    console.log("Initializing BuySmart Enterprise Follow System");
    
    // Update the follower count when the page loads
    updateFollowerCount();
    
    // Add event listener to the follow button
    const followButton = document.getElementById('follow-button');
    if (followButton) {
        followButton.addEventListener('click', followBuySmart);
    }
    
    // Add event listener to the follow button in the header
    const followButtonHeader = document.getElementById('follow-button-header');
    if (followButtonHeader) {
        followButtonHeader.addEventListener('click', followBuySmart);
    }
}

// Run initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', initFollow);
