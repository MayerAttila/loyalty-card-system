"use client";

import React, { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

type BusinessLocation = {
  locationPlaceId: string | null;
  locationAddress: string | null;
  locationLat: number | null;
  locationLng: number | null;
};

type LocationSelectorPanelProps = {
  location: BusinessLocation;
  onChange: (location: BusinessLocation) => void;
  disabled?: boolean;
};

let googleMapsLoader: Promise<any> | null = null;

const DEFAULT_CENTER = { lat: 47.7636, lng: 18.1261 };
const DEFAULT_ZOOM = 12;

const loadGoogleMaps = (apiKey: string) => {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google Maps can only load in the browser."),
    );
  }

  const googleFromWindow = (window as { google?: any }).google;
  if (googleFromWindow?.maps?.places) {
    return Promise.resolve(googleFromWindow);
  }

  if (!googleMapsLoader) {
    googleMapsLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => resolve((window as { google?: any }).google);
      script.onerror = () =>
        reject(new Error("Unable to load the Google Maps script."));
      document.head.appendChild(script);
    });
  }

  return googleMapsLoader;
};

const LocationSelectorPanel = ({
  location,
  onChange,
  disabled,
}: LocationSelectorPanelProps) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [inputValue, setInputValue] = useState(location.locationAddress ?? "");
  const [loadError, setLoadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const autocompleteInstance = useRef<any>(null);
  const geocoderInstance = useRef<any>(null);
  const mapClickListener = useRef<any>(null);
  const locationRef = useRef(location);

  useEffect(() => {
    setInputValue(location.locationAddress ?? "");
  }, [location.locationAddress]);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const syncMapToLocation = (target: BusinessLocation) => {
    if (!mapInstance.current || !markerInstance.current) return;
    const hasCoords =
      typeof target.locationLat === "number" &&
      typeof target.locationLng === "number";
    const center = hasCoords
      ? { lat: target.locationLat!, lng: target.locationLng! }
      : DEFAULT_CENTER;
    const zoom = hasCoords ? 15 : DEFAULT_ZOOM;
    mapInstance.current.setCenter(center);
    mapInstance.current.setZoom(zoom);
    markerInstance.current.setPosition(center);
  };

  useEffect(() => {
    if (!apiKey || !inputRef.current || !mapRef.current) return;

    let isMounted = true;
    loadGoogleMaps(apiKey)
      .then((googleMaps) => {
        if (!isMounted || !mapRef.current || !inputRef.current) return;

        if (!mapInstance.current) {
          mapInstance.current = new googleMaps.maps.Map(mapRef.current, {
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
        }

        if (!markerInstance.current) {
          markerInstance.current = new googleMaps.maps.Marker({
            map: mapInstance.current,
            position: DEFAULT_CENTER,
          });
        }

        syncMapToLocation(locationRef.current);

        if (!geocoderInstance.current) {
          geocoderInstance.current = new googleMaps.maps.Geocoder();
        }

        if (!autocompleteInstance.current) {
          autocompleteInstance.current =
            new googleMaps.maps.places.Autocomplete(inputRef.current, {
              fields: ["place_id", "formatted_address", "geometry"],
            });
          autocompleteInstance.current.addListener("place_changed", () => {
            const place = autocompleteInstance.current?.getPlace();
            const geometry = place?.geometry?.location;
            if (!geometry) {
              setLoadError("Selected place has no location data.");
              return;
            }

            const lat = geometry.lat();
            const lng = geometry.lng();
            const formattedAddress = place?.formatted_address ?? "";

            setInputValue(formattedAddress);
            setLoadError(null);
            mapInstance.current?.setCenter({ lat, lng });
            mapInstance.current?.setZoom(15);
            markerInstance.current?.setPosition({ lat, lng });
            onChange({
              locationPlaceId: place?.place_id ?? null,
              locationAddress: formattedAddress || null,
              locationLat: lat,
              locationLng: lng,
            });
          });
        }

        if (!mapClickListener.current) {
          mapClickListener.current = mapInstance.current.addListener(
            "click",
            (event: { latLng?: { lat: () => number; lng: () => number } }) => {
              const latLng = event.latLng;
              if (!latLng || !geocoderInstance.current) return;

              const lat = latLng.lat();
              const lng = latLng.lng();
              mapInstance.current?.setCenter({ lat, lng });
              mapInstance.current?.setZoom(15);
              markerInstance.current?.setPosition({ lat, lng });

              geocoderInstance.current.geocode(
                { location: { lat, lng } },
                (
                  results: Array<{
                    formatted_address?: string;
                    place_id?: string;
                    types?: string[];
                  }>,
                  status: string,
                ) => {
                  if (status !== "OK" || !results?.length) {
                    setInputValue(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
                    setLoadError("Unable to resolve an address for this spot.");
                    onChange({
                      locationPlaceId: null,
                      locationAddress: null,
                      locationLat: lat,
                      locationLng: lng,
                    });
                    return;
                  }

                  const preferred =
                    results.find((item) =>
                      item.types?.some((type) =>
                        [
                          "street_address",
                          "premise",
                          "subpremise",
                          "establishment",
                          "point_of_interest",
                        ].includes(type),
                      ),
                    ) ?? results[0];
                  const formattedAddress = preferred?.formatted_address ?? "";

                  setInputValue(
                    formattedAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
                  );
                  setLoadError(null);
                  onChange({
                    locationPlaceId: preferred?.place_id ?? null,
                    locationAddress: formattedAddress || null,
                    locationLat: lat,
                    locationLng: lng,
                  });
                },
              );
            },
          );
        }
      })
      .catch((error: Error) => {
        if (!isMounted) return;
        setLoadError(error.message);
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, onChange]);

  useEffect(() => {
    syncMapToLocation(location);
  }, [location.locationLat, location.locationLng]);

  const hasLocation =
    typeof location.locationLat === "number" &&
    typeof location.locationLng === "number" &&
    Boolean(location.locationAddress);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <label
          className="text-xs font-semibold text-contrast/70"
          htmlFor="locationSearch"
        >
          Search for an address
        </label>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            id="locationSearch"
            ref={inputRef}
            type="text"
            placeholder="Search for a place"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            disabled={disabled || !apiKey}
            className="w-full rounded-lg border border-accent-3 bg-contrast/5 px-3 py-2 text-sm text-contrast outline-none placeholder:text-contrast/50"
          />
          <Button
            variant="neutral"
            size="sm"
            onClick={() =>
              onChange({
                locationPlaceId: null,
                locationAddress: null,
                locationLat: null,
                locationLng: null,
              })
            }
            disabled={disabled || !hasLocation}
            className="whitespace-nowrap"
          >
            Clear location
          </Button>
        </div>
        {loadError ? <p className="text-xs text-red-400">{loadError}</p> : null}
      </div>

      <div className="flex items-center gap-2">
        {!apiKey ? (
          <span className="text-xs text-contrast/60">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable search.
          </span>
        ) : null}
      </div>

      <div className="relative overflow-hidden rounded-lg border border-accent-3 bg-contrast/5">
        <div className="absolute left-3 top-3 rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-contrast/70">
          Map preview
        </div>
        <div ref={mapRef} className="h-80 w-full" />
      </div>
    </div>
  );
};

export default LocationSelectorPanel;
