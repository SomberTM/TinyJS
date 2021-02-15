import { Client } from './api/Client';
import { IntentFlag, Intents } from './api/gateway/Intents';
import { StructureManager } from './api/managers/StructureManager';
import { UserManager } from './api/managers/UserManager';
import { BitField } from './utils/BitField';
import { Json } from "./utils/Json";
import { Cache } from "./utils/Cache";
import { Class } from './utils/Util';
import { User } from './api/structures/User';
import { Permissions } from './utils/Permissions';
import { Role } from './api/structures/Role';
import { Channel, ChannelType, GuildChannel } from './api/structures/Channels';
import { Presence } from './api/structures/Presence';
import { MessageEmbed, MessageEmbedField } from './api/structures/MessageEmbed';
import { Color, Colors } from './utils/Color';

(async function() {

    // -- Json tests

    // const mirror = Json.mirrorFormated([ "rateLimit", "guildCreated" ], (e: string) => { return Case.snake(e).toUpperCase(); });
    // console.log(mirror);

    // const json = { rateLimit: 'rateLimit' };
    // console.log(json);

    // const formatted = Json.formatKeys(json, (e: string) => { return Case.snake(e).toUpperCase() });
    // console.log(formatted);
    
    // const foo = { hello: 'world' };
    // const bar = { complex: { type: foo } };
    // const x = Json.copy(bar);
    // console.log(x.complex.type.hello);

    // const baseOptions = { ttl: 0 };
    // const providedOptions = { ttl: 5, iterable: ["a", "b"] };
    // console.log(Json.merge(baseOptions, providedOptions));

    // -- Discord Tests

    //const intents = new Intents([ 'GUILDS', 'GUILD_BANS' ]);
    //console.log(intents.has('DIRECT_MESSAGES'));

    // const intents = new Intents([ 'GUILDS', 'GUILD_BANS' ]);
    // console.log(intents.missing());

    const client: Client = new Client();

    await client.login('NzUyMjQ0MDM1NTgxNjQwNzI1.X1Uz2g.g-w5Y8EaSDvByCC_kSWWhu7lh8A', Intents.ALL);

    const sleep = (ms: number) => {
        return new Promise<void>((res, rej) => {
            setTimeout(() => {
                res();
            }, ms);
        })
    }

    await sleep(10000);

    let guild = client.guilds.resolve("749069860050436152")!;

    console.log(guild);

    // let embed = new MessageEmbed().setTitle("Title").setAuthor({ name: "Author" });

    // console.log(embed.toJson());

    // let presence = guild.presences.find((presence: Presence) => presence.activities.length > 0);

    // console.log(guild)
    // let vs = guild.voiceStates.cache.first();
    // console.log(vs);
    // console.log(`'${vs?.user.username}' is connected to '${vs?.channel.name}'`)
    // console.log(guild.channels.cache.map((value: GuildChannel) => `${value.typeString}: ${value.name}`));

    // let testRole = guild?.roles.cache.find((role: Role) => role.tags != undefined);
    // let testEmoji = guild.emojis.cache.first()!;
    // console.log(testEmoji);

})();
