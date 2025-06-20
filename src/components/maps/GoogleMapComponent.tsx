import React, { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Circle,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantIcon from "@mui/icons-material/Restaurant";

interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  isActive: boolean;
  deliveryRadius: number; // in kilometers
  image?: string;
}

interface GoogleMapComponentProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  showDeliveryRadius?: boolean;
  enableCurrentLocation?: boolean;
}

const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City
const defaultZoom = 12;

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
  restaurants,
  center = defaultCenter,
  zoom = defaultZoom,
  height = "400px",
  onRestaurantClick,
  showDeliveryRadius = false,
  enableCurrentLocation = true,
}) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places', 'geometry'],
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          
          // Pan to user location
          if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(14);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  };

  const getMarkerIcon = (restaurant: Restaurant) => {
    return {
      url: restaurant.isActive 
        ? "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#4CAF50" stroke="#fff" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="18">🍽️</text>
          </svg>
        `)
        : "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#f44336" stroke="#fff" stroke-width="2"/>
            <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="18">🍽️</text>
          </svg>
        `),
      scaledSize: new window.google.maps.Size(40, 40),
    };
  };

  if (loadError) {
    return (
      <Card sx={{ height }}>
        <CardContent>
          <Typography color="error">
            Error loading Google Maps. Please check your API key.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card sx={{ height }}>
        <CardContent>
          <Typography>Loading map...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ position: "relative", height }}>
      {enableCurrentLocation && (
        <Button
          variant="contained"
          size="small"
          onClick={getCurrentLocation}
          startIcon={<LocationOnIcon />}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 1,
          }}
        >
          My Location
        </Button>
      )}

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={userLocation || center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="8" fill="#2196F3" stroke="#fff" stroke-width="2"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(20, 20),
            }}
            title="Your Location"
          />
        )}

        {/* Restaurant markers */}
        {restaurants.map((restaurant) => (
          <React.Fragment key={restaurant.id}>
            <Marker
              position={{
                lat: restaurant.latitude,
                lng: restaurant.longitude,
              }}
              icon={getMarkerIcon(restaurant)}
              onClick={() => {
                setSelectedRestaurant(restaurant);
                if (onRestaurantClick) {
                  onRestaurantClick(restaurant);
                }
              }}
              title={restaurant.name}
            />

            {/* Delivery radius circle */}
            {showDeliveryRadius && restaurant.isActive && (
              <Circle
                center={{
                  lat: restaurant.latitude,
                  lng: restaurant.longitude,
                }}
                radius={restaurant.deliveryRadius * 1000} // Convert km to meters
                options={{
                  fillColor: "#4CAF50",
                  fillOpacity: 0.1,
                  strokeColor: "#4CAF50",
                  strokeOpacity: 0.3,
                  strokeWeight: 2,
                }}
              />
            )}
          </React.Fragment>
        ))}

        {/* Info window for selected restaurant */}
        {selectedRestaurant && (
          <InfoWindow
            position={{
              lat: selectedRestaurant.latitude,
              lng: selectedRestaurant.longitude,
            }}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <Box sx={{ maxWidth: 250, p: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar
                  src={selectedRestaurant.image}
                  sx={{ width: 40, height: 40, mr: 1 }}
                >
                  <RestaurantIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                    {selectedRestaurant.name}
                  </Typography>
                  <Chip
                    label={selectedRestaurant.isActive ? "Active" : "Inactive"}
                    size="small"
                    color={selectedRestaurant.isActive ? "success" : "error"}
                  />
                </Box>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedRestaurant.address}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                Rating: {selectedRestaurant.rating.toFixed(1)} ⭐
              </Typography>
              
              {showDeliveryRadius && (
                <Typography variant="body2" color="primary">
                  Delivery radius: {selectedRestaurant.deliveryRadius} km
                </Typography>
              )}
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </Box>
  );
};

export default GoogleMapComponent; 