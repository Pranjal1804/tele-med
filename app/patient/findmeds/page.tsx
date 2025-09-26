"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/patient/dashboard-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Search,
  Loader2,
  MapPin,
  ServerCrash,
  LocateFixed,
} from "lucide-react";
import axios from "axios";

// Define the structure for a store returned by the API
interface StoreResult {
  storeName: string;
  distance: number; // in meters
}

export default function FindMedsPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<StoreResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Function to get the user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setIsLoading(false);
      },
      () => {
        setError(
          "Unable to retrieve your location. Please enable location services."
        );
        setIsLoading(false);
      }
    );
  };

  // Attempt to get location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Main search handler
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a medicine name.");
      return;
    }
    if (!location) {
      setError(
        "Your location is not available. Please grant permission and try again."
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);

    try {
      // *** THIS IS THE CORRECTED LINE ***
      // Your server is running on port 3005.
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://pharma-find.onrender.com";

      const response = await axios.get(`${backendUrl}/search`, {
        params: {
          medName: searchTerm,
          userLat: location.lat,
          userLon: location.lon,
        },
      });

      setResults(response.data || []);
    } catch (err) {
      console.error("Search API error:", err);
      setError(
        "Failed to fetch results. Ensure the backend server is running on the correct port."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format distance from meters to a readable string
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-secondary/5">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-balance">
              Find Medicines Nearby 📍
            </h1>
            <p className="text-muted-foreground">
              Enter the name of the medicine to find it in stores near you.
            </p>
          </div>

          {/* Search Input Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="text"
                  placeholder="e.g., Paracetamol, Crocin"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-grow text-base"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !location}
                  size="lg"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
              {!location && !error && (
                <div className="text-sm text-muted-foreground mt-3 flex items-center justify-center gap-2">
                  <LocateFixed className="w-4 h-4 animate-spin" />
                  <span>Attempting to get your location...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-4">
            {isLoading && (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">
                  Searching nearby stores...
                </p>
              </div>
            )}

            {error && (
              <Card className="bg-destructive/10 border-destructive">
                <CardContent className="pt-6 flex items-center gap-4">
                  <ServerCrash className="w-8 h-8 text-destructive" />
                  <div>
                    <p className="font-semibold text-destructive">
                      An Error Occurred
                    </p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {!isLoading && !error && results.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Stores</CardTitle>
                  <CardDescription>
                    Showing stores nearest to you that have "{searchTerm}".
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y">
                    {results.map((store, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between py-4"
                      >
                        <div className="flex items-center gap-4">
                          <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-semibold">{store.storeName}</p>
                            <p className="text-sm text-muted-foreground">
                              Availability confirmed
                            </p>
                          </div>
                        </div>
                        <span className="font-medium text-sm rounded-full bg-secondary/20 px-3 py-1 text-secondary-foreground whitespace-nowrap">
                          {formatDistance(store.distance)} away
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {!isLoading && !error && results.length === 0 && hasSearched && (
              <Card className="bg-accent/50 border-dashed">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    No stores found with "{searchTerm}" near you.
                  </p>
                  <p className="text-sm text-muted-foreground/80">
                    Please check the spelling or try another medicine.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
