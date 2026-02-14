import requests
from math import radians, cos, sin, asin, sqrt

# 1. GEODETIC CALCULATIONS (Haversine Formula)

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculates the great-circle distance between two points 
    on the Earth's surface using the Haversine formula.
    """
    if not all([lat1, lon1, lat2, lon2]):
        return None

    # Convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [float(lon1), float(lat1), float(lon2), float(lat2)])

    # Haversine formula
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371  # Radius of earth in kilometers. Use 3956 for miles
    
    return c * r

# 2. OPENSTREETMAP (NOMINATIM) GEOCODING

def get_coords_from_address(address):
    """
    Calls the OpenStreetMap Nominatim API to convert a 
    string address into Latitude and Longitude.
    """
    base_url = "https://nominatim.openstreetmap.org/search"
    params = {
        'q': address,
        'format': 'json',
        'limit': 1
    }
    
    # OSM requires a descriptive User-Agent to prevent 403 errors
    headers = {
        'User-Agent': 'Q-Flow-Queue-Management-Project (Contact: your-email@example.com)'
    }

    try:
        response = requests.get(base_url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data:
            return {
                'lat': float(data[0]['lat']),
                'lon': float(data[0]['lon'])
            }
    except Exception as e:
        print(f"Geocoding Error: {e}")
        
    return None

# 3. CROWD STATUS LOGIC

def get_crowd_status(waiting_count):
    """
    Standardizes the crowd status and color coding used 
    by the frontend Discovery Page.
    """
    if waiting_count < 5:
        return {"status": "Low", "color": "bg-emerald-500"}
    elif waiting_count < 15:
        return {"status": "Medium", "color": "bg-amber-500"}
    else:
        return {"status": "High", "color": "bg-rose-500"}