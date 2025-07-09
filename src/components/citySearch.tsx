import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Clock, Loader2, Search, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use.weather";
import { CommandSeparator } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use.seach.history";
import { format } from "date-fns";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: locations, isLoading } = useLocationSearch(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split("|");
    //Add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });
    setOpen(false);
    navigate(`city/${name}??lat=${lat}&lon=${lon}`);
  };
  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities...
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}
          {/* <CommandGroup heading="Favorites">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup> */}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                    <p className="text-xs text-muted-foreground">Recent Searches</p>
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={()=> clearHistory.mutate()}
                    >
                        <XCircle className="h-4 w-4"/>
                        Clear
                    </Button>
                </div>
                {history.map((locations)=>{
                    return (
                          <CommandItem
                    key={`${locations.lat}-${locations.lon}`}
                    value={`${locations.lat}|${locations.lon}|${locations.name}|${locations.country}`}
                    onSelect={handleSelect}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{locations.name}</span>
                    {locations.state && (
                      <span className="text-sm text-muted-foreground">
                        ,{locations.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      ,{locations.country}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                        {format(locations.searchedAt,"MMM d , h:mm a")}
                    </span>
                  </CommandItem>
                    );
                })}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          {locations && locations.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {locations.map((locations) => {
                return (
                  <CommandItem
                    key={`${locations.lat}-${locations.lon}`}
                    value={`${locations.lat}|${locations.lon}|${locations.name}|${locations.country}`}
                    onSelect={handleSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{locations.name}</span>
                    {locations.state && (
                      <span className="text-sm text-muted-foreground">
                        ,{locations.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      ,{locations.country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
