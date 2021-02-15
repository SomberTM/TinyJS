import { Json } from "../../utils/Json";
import { Client } from "../Client";
import { VoiceChannel } from "./Channels";
import { Guild } from "./Guild";
import { GuildMember } from "./GuildMember";
import { Structure } from "./Structure";
import { User } from "./User";

@Json.Json
export class VoiceState extends Structure {

    constructor(client: Client, guild: Guild, data: Json.Acceptable<any>) {
        super(client);
        this.guild = guild;
        this.guildID = guild.id;

        Json.construct(this, data);

        this.member = guild.members.cache.get(this.userID)!;
        this.user = client.users.cache.get(this.userID)!;
        this.channel = guild.channels.cache.get<VoiceChannel>(this.channelID)!;
    }

    public guild: Guild;
    public guildID: string;

    public member: GuildMember;

    @Json.Property("channel_id")
    public channelID!: string;
    public channel: VoiceChannel;

    @Json.Property("user_id")
    public userID!: string;
    public user!: User;

    @Json.Property("session_id")
    public sessionID!: string;

    @Json.Property("deaf")
    public serverDeafened!: boolean;

    @Json.Property("mute")
    public serverMuted!: boolean;

    @Json.Property("self_deaf")
    public selfDeafened!: boolean;

    @Json.Property("self_mute")
    public selfMuted!: boolean;

    @Json.Default("self_stream", false)
    public streaming!: boolean;

    @Json.Property("self_video")
    public cameraEnabled!: boolean;

}