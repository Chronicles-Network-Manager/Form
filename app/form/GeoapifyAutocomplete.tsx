import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { TagInput, Tag } from "emblor";
import { Loader2 } from "lucide-react";

interface CurrentLocation {
  formatted: string;
  address: string;
  address2: string;
  city: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  postcode: string;
}

interface GeoapifyTagInputProps {
  value: CurrentLocation[];
  onChange: (value: CurrentLocation[]) => void;
}

export const GeoapifyAutocomplete: React.FC<GeoapifyTagInputProps> = ({
  value,
  onChange,
}) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [autocompleteOptions, setAutocompleteOptions] = useState<Tag[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (inputValue.length > 1) fetchSuggestions(inputValue);
      else setAutocompleteOptions([]);
    }, 300);

    return () => clearTimeout(delay);
  }, [inputValue]);

  const fetchSuggestions = async (query: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "https://api.geoapify.com/v1/geocode/autocomplete",
        {
          params: {
            text: query,
            apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
            limit: 5,
          },
        }
      );

      const options: Tag[] = data.features.map((feature: any) => ({
        id: feature.properties.formatted,
        text: feature.properties.formatted,
      }));

      setAutocompleteOptions(options);
    } catch (err) {
      console.error("Geoapify error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTagAdd = (newTagText: string) => {
    const matchingFeature = autocompleteOptions.find(
      (opt) => opt.text === newTagText
    );

    if (!matchingFeature) return;

    axios
      .get("https://api.geoapify.com/v1/geocode/autocomplete", {
        params: {
          text: newTagText,
          apiKey: process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY,
          limit: 1,
        },
      })
      .then((res) => {
        const feature = res.data.features[0];
        let city = feature.properties.city ?? "";
        const country = feature.properties.country ?? "";

        // 🔒 Special cases where city = country
        if (["Monaco", "Singapore", "Vatican City"].includes(country)) {
          city = country;
        }

        const location: CurrentLocation = {
          city,
          country,
          state: feature.properties.state ?? "",
          latitude: feature.properties.lat,
          longitude: feature.properties.lon,
          formatted: feature.properties.formatted,
          postcode: feature.properties.postcode || "",
          address: feature.properties.formatted,
          address2: feature.properties.address_line2 || "",
        };

        onChange([...value, location]);
        // Don't call setTags here unless you're customizing UI independently
      })
      .catch((err) => {
        console.error("Failed to fetch location data for tag:", err);
      });
  };

  return (
    <div className="relative w-full">
      <TagInput
        ref={inputRef}
        tags={tags}
        setTags={setTags}
        placeholder="Add a location..."
        enableAutocomplete={true}
        autocompleteOptions={autocompleteOptions}
        onInputChange={(val) => setInputValue(val)}
        onTagAdd={(newTagText) => {
          setInputValue("");
          inputRef.current?.focus();
          handleTagAdd(newTagText);
        }}
        maxTags={1}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
      />

      {loading && (
        <div className="absolute right-2 top-2">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
