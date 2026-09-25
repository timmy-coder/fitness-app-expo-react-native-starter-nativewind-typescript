// NativeWind processes this stylesheet at build time; TypeScript has no module declaration for it.
// @ts-expect-error -- side-effect CSS import is handled by Expo/NativeWind.
import "../global.css";
import { Slot, Stack, Tabs } from "expo-router";
import {ClerkProvider} from "@clerk/expo"
import AntDesign from "@expo/vector-icons/AntDesign";
import { tokenCache } from '@clerk/expo/token-cache'
import "@/lib/polyfills";

declare const process: {
  env: {
    EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  };
};

export default function Layout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {/* Slot finds the main index page to render */}
      <Slot/> 
    </ClerkProvider>
  );
}
