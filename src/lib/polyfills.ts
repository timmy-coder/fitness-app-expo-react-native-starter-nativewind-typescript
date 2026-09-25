import "react-native-url-polyfill/auto";
// The package's declaration file is not exposed through its package.json exports.
// @ts-expect-error -- event-target-shim ships types that TypeScript cannot resolve here.
import { Event, EventTarget } from "event-target-shim";

// @ts-ignore
if (typeof global.Event === "undefined") {
  // @ts-ignore
  global.Event = Event;
}

// @ts-ignore
if (typeof global.EventTarget === "undefined") {
  // @ts-ignore
  global.EventTarget = EventTarget;
}