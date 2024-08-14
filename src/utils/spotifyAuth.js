// src/utils/spotifyAuth.js

const CLIENT_ID = "d371182dfefa4ad49acbdbb05c74cbea";
const CLIENT_SECRET = "b072a9002eba4c8f8766650802ece1e8";

export async function getToken() {
    const authString = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const authBase64 = btoa(authString);
    const url = "https://accounts.spotify.com/api/token";

    const headers = new Headers({
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error getting token:', error);
        throw error;
    }
}

export function getAuthHeader(token) {
    return { 'Authorization': `Bearer ${token}` };
}