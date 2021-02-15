import { gateway } from "../utils/Constants";
import { Logger } from "../utils/Logger";
import { Gateway } from "./gateway/Gateway";
import { Intents, IntentsResolvable } from "./gateway/Intents";
import { ChannelManager } from "./managers/ChannelManager";
import { GuildManager } from "./managers/GuildManager";
import { MessageManager } from "./managers/MessageManager";
import { UserManager } from "./managers/UserManager";
import { User } from "./structures/User";

export class Client {
    
    public logger: Logger = new Logger({ dateTime: true, file: true });
    public ws!: Gateway;
    public users!: UserManager;
    public guilds!: GuildManager;
    public channels!: ChannelManager;
    public messages!: MessageManager;
    public user!: User;

    constructor() {
        this.destroy();
    }

    public async login(token: string, intents: IntentsResolvable = gateway.identity.intents) {
        intents = Intents.resolve(intents);
        this.user = await this.ws.connect(token, intents);
    }

    public destroy(): void {
        if (this.ws && this.ws.socket) this.ws.socket.close();
        Object.defineProperty(this, 'ws', { value: new Gateway(this) }) ;
        this.users = new UserManager(this);
        this.guilds = new GuildManager(this);
        this.channels = new ChannelManager(this);
        this.messages = new MessageManager(this);
    }

}