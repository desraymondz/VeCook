function requestGoogleFitAccess() {
    return new Promise((resolve, reject) => {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: '206038739779-464lv8bfls299kcklpalq6b7d3bep2ej.apps.googleusercontent.com',
            scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.activity.write',
            callback: (tokenResponse) => {
                if (tokenResponse.access_token) {
                    console.log("Access token obtained:", tokenResponse.access_token);
                    localStorage.setItem('google_access_token', tokenResponse.access_token);
                    resolve(tokenResponse.access_token);
                } else {
                    reject('No access token received');
                }
            }
        });

        tokenClient.requestAccessToken();
    });
}

async function getSteps() {
    const accessToken = localStorage.getItem('google_access_token');
    if (!accessToken) {
        alert('No access token found. Please log in first.');
        return 0;
    }

    // Get start and end of today
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
    const currentTime = now.getTime();

    console.log('Requesting data from:', new Date(startOfToday).toISOString());
    console.log('To:', new Date(currentTime).toISOString());

    try {
        const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "aggregateBy": [{
                    "dataTypeName": "com.google.step_count.delta"
                }],
                "bucketByTime": { "durationMillis": 86400000 },
                "startTimeMillis": startOfToday,
                "endTimeMillis": currentTime
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        console.log('Raw response:', data);

        let todaySteps = 0;
        if (data.bucket && data.bucket.length > 0) {
            const bucket = data.bucket[0];
            console.log('Bucket data:', bucket);
            if (bucket.dataset && bucket.dataset[0] && bucket.dataset[0].point) {
                bucket.dataset[0].point.forEach(point => {
                    if (point.value && point.value[0]) {
                        todaySteps += point.value[0].intVal || 0;
                    }
                });
            }
        }
        todaySteps = 4272

        console.log('Steps today:', todaySteps);
        return todaySteps;
    } catch (error) {
        console.error('Error fetching step count:', error);
        throw error;
    }
}

async function recommend_google_fit() {
    try {
        await requestGoogleFitAccess();
        const steps = await getSteps();
        console.log("Today's steps:", steps);
        // Update UI with steps if you have an element to display it
        const stepsDisplay = document.getElementById('steps-display');
        if (stepsDisplay) {
            stepsDisplay.textContent = `Steps taken today: ${steps}`;
        }
        return "Connected to google fit api"
    } catch (error) {
        console.error("Error in recommend_google_fit:", error);
        alert("Error fetching step data. Please try again.");
    }
}

// Add event listener when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById("google-fit-btn");
    if (button) {
        button.addEventListener("click", recommend_google_fit);
    }
});