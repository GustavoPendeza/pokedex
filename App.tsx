import { StatusBar } from "react-native";
import { Routes } from "./src/routes";

export default function App() {
  return (
    <>
      <Routes />
      <StatusBar barStyle='default' backgroundColor='transparent' translucent />
    </>
  )
}