import requests
import json

# URL for the API endpoint
url = 'https://places.googleapis.com/v1/places:searchText'
def return_centers(town):
    # JSON payload to be sent in the POST request
    data = {
        "textQuery" : f"Recycling Centers in {town}"
    }

    # Headers including the API Key and other necessary information
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': 'AIzaSyAfDdTzbssHT_Bo7YLzqoi5WesIB96PjXY',  # Replace 'API_KEY' with your actual Google Maps API key
        'X-Goog-FieldMask': 'places.displayName'
    }

    # Sending the POST request
    response = requests.post(url, headers=headers, data=json.dumps(data))

    # Check if the request was successful
    if response.status_code == 200:
        return(response.json()['places'][0]['displayName']['text'])
    else:
        print(f"Failed to make request: {response.status_code}")
        print(response.text)

