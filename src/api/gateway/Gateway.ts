import ws from "ws"
import { gateway } from "../../utils/Constants";
import { dynamicPromise, DynamicPromise } from "../../utils/DynamicPromise";
import { Endpoints } from "../../utils/Endpoints";
import { Client } from "../Client";
import { Guild } from "../structures/Guild";
import { Message } from "../structures/Message";
import { User } from "../structures/User";
import { Payload, Ready } from "./Payload";

export class Gateway {

    public static encode: (value: any) => string = JSON.stringify;
    public static decode: (text: any) => any = JSON.parse;

    public client: Client;
    public socket: ws | undefined;

    public heartbeat = {
        interval: 0,
        lastACK: Date.now(),
        ACKbuffer: 5000,
        times: 0
    }

    public sequence: { 
        current: number | null, 
        last: number | null 
    } = {
        current: null,
        last: null
    }

    public sessionID: string | null = null;
    public reconnecting: boolean = false;

    private data!: { token?: string, intents?: number };

    constructor(client: Client) {
        this.client = client;

        // data wont be shown when using console.log by defining the property like this
        Object.defineProperty(this, 'data', {
            value: {
                token: undefined,
                intents: undefined
            }
        })
    }

    public async connect(token: string, intents: number): Promise<User> {
        if (this.socket)
            this.socket.close(gateway.closeCode.SESSION_TIMED_OUT);
        
        this.socket = new ws(Endpoints.gateway);
        this.data.intents = intents;
        this.data.token = token;

        this.socket.on('open', () => {
            this.client.logger.log("INFO", `Gateway opened`);
        });

        const { resolve, reject, awaitable }: DynamicPromise<User> = dynamicPromise<User>();

        const op = gateway.op;
        this.socket.on('message', async (data: ws.Data) => {
            
            const payload: Payload = new Payload(Gateway.decode(data));

            this.sequence.last = this.sequence.current;
            this.sequence.current = payload.sequence;

            switch (payload.opcode)
            {

                case op.HELLO:
                    this.heartbeat.interval = payload.data.heartbeat_interval;

                    const identity = Gateway.encode({
                        op: op.IDENTIFY,
                        d: {
                            token,
                            intents,
                            properties: gateway.identity.properties,
                            compress: gateway.identity.compress,
                            shard: gateway.identity.shard,
                            large_threshold: gateway.identity.large_threshold,
                        }
                    });

                    await this.send(identity);
                    this.client.logger.log("INFO", `Identified with gateway [Intents=${intents}]`);

                    setInterval(async () => {
                        this.checkACKStatus();
                        await this.sendHeartbeat();
                    }, this.heartbeat.interval);
                    break;

                case op.DISPATCH:
                    switch(payload.eventName)
                    {

                        case gateway.dispatch.READY:
                            const ready: Ready = new Ready(payload.data);
                            this.sessionID = ready.sessionID;

                            if (this.reconnecting)
                            {
                                await this.send(Gateway.encode({
                                    op: op.RESUME,
                                    d: {
                                        token,
                                        session_id: this.sessionID,
                                        seq: this.sequence.last
                                    }
                                }));
                                this.client.logger.log("INFO", `Sequence [${this.sequence.last}] resumed`);
                                this.reconnecting = false;
                            }

                            this.client.logger.log("INFO", `Gateway ready`);
                            resolve(this.client.users.cache.getOrCreate(ready.user.id, this.client, ready.user));
                            break;

                        case gateway.dispatch.GUILD_CREATE:
                            this.client.guilds.cache.add(payload.data.id, new Guild(this.client, payload.data));
                            break;

                        case gateway.dispatch.MESSAGE_CREATE:
                            this.client.messages.cache.add(payload.data.id, new Message(this.client, payload.data));
                            break;

                        case gateway.dispatch.MESSAGE_REACTION_ADD:
                            console.log(payload.data);
                            break;
                    }
                    break;

                case op.RECONNECT:
                    this.reconnecting = true;
                    this.connect(token, intents);
                    break;

                case op.HEARTBEAT:
                    this.sendHeartbeat();
                    break;

                case op.HEARTBEAT_ACK:
                    this.heartbeat.lastACK = Date.now();
                    break;
            }

        });

        return awaitable;

    }

    private checkACKStatus() {
        if (!this.data.token || !this.data.intents)
            return;

        const lastACK: number = this.heartbeat.lastACK + this.heartbeat.ACKbuffer + this.heartbeat.interval;
        if (lastACK <= Date.now())
            this.connect(this.data.token, this.data.intents);
    }

    private async sendHeartbeat() {
        if (this.socket?.readyState == ws.OPEN)
        {
            this.heartbeat.times++;
            this.client.logger.log("INFO", `Sending heartbeat #[${this.heartbeat.times}]`);
            await this.send(Gateway.encode({
                op: gateway.op.HEARTBEAT,
                d: this.sequence.current
            }));
            this.client.logger.log("INFO", `Sent heartbeat #[${this.heartbeat.times}]`);
        }
    }

    public async send(data: ws.Data): Promise<void> {
        const { resolve, reject, awaitable } = dynamicPromise();
        this.socket?.send(data, (err) => {
            if (err) reject(err);
            else resolve();
        })     
        return awaitable;
    }

}