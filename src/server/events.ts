import { GlobalEvents } from "shared/events";

/**
 * Lets you fire off events that go from `Server -> Client` and listen to events that go from `Client -> Server`
 */
export const Events = GlobalEvents.server;
