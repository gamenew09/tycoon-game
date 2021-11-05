import { GlobalEvents } from "shared/events";

/**
 * Lets you fire off events that go from `Client -> Server` and listen to events that go from `Server -> Client`
 */
export const Events = GlobalEvents.client;
