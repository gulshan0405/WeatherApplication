import WeatherSkeleton from "@/components/loading.sekeleton";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/use.geolocation";
import { MapPin, RefreshCw, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use.weather";
import CurrentWeather from "@/components/CurrentWeather";
import HourlyTemprature from "@/components/Hourly_temp";
import WeatherDetails from "@/components/Weather-detail";
import WeatherForecast from "@/components/weather-forecast";
import FavoriteCities from "@/components/FavoriteCities";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  console.log(weatherQuery.data);
  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };
  if (locationLoading) {
    return <WeatherSkeleton />;
  }
  if (locationError) {
    return (
      <Alert variant={"destructive"}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant={"destructive"}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Location Requried</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>please enable location access to see your local weather</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName =locationQuery.data?.[0];

  if(weatherQuery.error || forecastQuery.error){
     return (<Alert variant={"destructive"}>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>failed to fetch data please try again</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            retry
          </Button>
        </AlertDescription>
      </Alert>
     );
  }

    if(!weatherQuery.data || !forecastQuery.data){
      return <WeatherSkeleton/>;
    }
  return (
    <div className="space-y-4">
      {/* Favorite Cities */}
      <FavoriteCities/>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight ">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw className={`h-4 w-4 ${weatherQuery.isFetching?"animate-spin":""}`} />
        </Button>
      </div>
      <div className="grid gap-6">
        <div className=" flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName}/>
         <HourlyTemprature data={forecastQuery.data}/>
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start" >
          {/* details about the weather  */}
          <WeatherDetails data={weatherQuery.data}/>
          {/* forecast about the weather  */}
          <WeatherForecast data={forecastQuery.data}/>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
