import { StatusBar } from "expo-status-bar";
import { TRPCProvider } from "./Provider";
import { SiniflarScreen } from "./screens/Siniflar";

export default function App() {
  return (
    <TRPCProvider>
      <SiniflarScreen />
      <StatusBar style="light" />
    </TRPCProvider>
  );
}
