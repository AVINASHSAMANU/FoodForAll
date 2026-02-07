const form = document.getElementById('eventForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page refresh

    // Collect values from form inputs
    const formData = {
        venueName: form.venueName.value,
        city: form.city.value,
        eventDate: form.eventDate.value,
        endTime: form.endTime.value,
        portions: form.portions.value,
        foodType: form.foodType.value
    };

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        alert(data.message); // Show success message
        form.reset();        // Clear form

    } catch (error) {
        console.error('Error submitting event:', error);
        alert('Failed to submit event. Please try again.');
    }
});
