import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "071f2afaa47ddd9a96fe87335e80c33b";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync();
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    )
      .then((response) => response.json())
      .then((data) =>
        setDays(
          data.list.filter((weather) => {
            if (weather.dt_txt.includes("09:00:00")) {
              return weather;
            }
          })
        )
      );
  };

  useEffect(() => {
    ask();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        // indicatorStyle="white"
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, i) => (
            <View style={styles.day} key={i}>
              <Fontisto
                style={styles.icon}
                name={icons[day.weather[0].main]}
                size={SCREEN_WIDTH / 4}
                color="white"
              />
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>

              <Text style={styles.temp}>
                {parseFloat(day.main.temp).toFixed(1)}
              </Text>
              <Text style={styles.description}>{day?.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day?.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  city: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: SCREEN_WIDTH / 8,
    fontWeight: 600,
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  date: {
    fontSize: SCREEN_WIDTH / 10,
    color: "white",
  },
  temp: {
    fontSize: SCREEN_WIDTH / 3,
    color: "white",
    marginBottom: 20,
  },
  description: {
    marginTop: -30,
    fontSize: SCREEN_WIDTH / 6,
    color: "white",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  },
  icon: {
    marginTop: 20,
    marginBottom: 20,
  },
});
