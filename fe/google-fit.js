function requestGoogleFitAccess() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '314191525165-kc28fl1kea1f7p85o5lhfilt5fkm2tdc.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/fitness.activity.read',
        callback: (tokenResponse) => {
            if (tokenResponse.access_token) {
                console.log("Access token obtained:", tokenResponse.access_token);
                localStorage.setItem('google_access_token', tokenResponse.access_token);
            }
        }
    });

    tokenClient.requestAccessToken();
}

async function getSteps() {
    const accessToken = localStorage.getItem('google_access_token');
    if (!accessToken) {
        alert('No access token found. Please log in first.');
        return 0; // Return 0 if no access token is available
    }

    console.log("Access Token:", accessToken); // Debugging

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    try {
        const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "aggregateBy": [{
                    "dataTypeName": "com.google.step_count.delta",
                    "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                }],
                "bucketByTime": { "durationMillis": 86400000 },
                "startTimeMillis": startOfToday,
                "endTimeMillis": now.getTime()
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        console.log('Raw response:', data);

        let totalSteps = 0;
        if (data.bucket) {
            data.bucket.forEach(bucket => {
                if (bucket.dataset && bucket.dataset.length > 0 && bucket.dataset[0].point.length > 0) {
                    bucket.dataset[0].point.forEach(point => {
                        if (point.value && point.value[0]) {
                            totalSteps += point.value[0].intVal || 0;
                        }
                    });
                }
            });
        }

        console.log('Steps:', totalSteps);
        return totalSteps; // ✅ Return total steps
    } catch (error) {
        console.error('Error fetching step count:', error);
        return 0; // Return 0 if an error occurs
    }
}
