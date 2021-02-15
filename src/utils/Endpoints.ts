import { gateway } from "./Constants";

export const Endpoints = {
    gateway: `wss://gateway.discord.gg/?v=${gateway.version}&encoding=${gateway.encoding}`
}
