import { Color, ColorResolvable } from "../../utils/Color";
import { Json } from "../../utils/Json";

export const MessageEmbedType = Json.mirror([
    "rich",
    "image",
    "video",
    "gifv",
    "article",
    "article",
    "link"
])

export interface IMessageEmbedFooter { text: string, icon_url?: string, proxy_icon_url?: string }
export class MessageEmbedFooter {
 
    constructor(data: IMessageEmbedFooter) {
        Json.construct(this, data);
    }

    @Json.Property()
    public text!: string;

    @Json.Property("icon_url")
    public iconUrl?: string;

    @Json.Property("proxy_icon_url")
    public proxyIconUrl?: string;

}

export interface IMessageEmbedImage { url?: string, proxy_url?: string, height?: number, width?: number };
export class MessageEmbedImage {
   
    constructor(data: IMessageEmbedImage) {
        Json.construct(this, data);
    }

    @Json.Property()
    public url?: string;

    @Json.Property("proxy_url")
    public proxyUrl?: string;

    @Json.Property()
    public height?: number;

    @Json.Property()
    public width?: number;

}

export interface IMessageEmbedVideo { url?: string, height?: number, width?: number }
export class MessageEmbedVideo {
   
    constructor(data: IMessageEmbedVideo) {
        Json.construct(this, data);
    }

    @Json.Property()
    public url?: string;

    @Json.Property()
    public height?: number;

    @Json.Property()
    public width?: number;

}

export interface IMessageEmbedProvider { name?: string, url?: string }
export class MessageEmbedProvider {

    constructor(data: IMessageEmbedProvider) {
        Json.construct(this, data);
    }

    @Json.Property()
    public name?: string;

    @Json.Property()
    public url?: string;

}

export interface IMessageEmbedAuthor { name?: string, url?: string, icon_url?: string, proxy_icon_url?: string }
export class MessageEmbedAuthor {

    constructor(data: IMessageEmbedAuthor) {
        Json.construct(this, data);
    }

    @Json.Property()
    public name?: string;

    @Json.Property()
    public url?: string;

    @Json.Property("icon_url")
    public iconUrl?: string;

    @Json.Property("proxy_icon_url")
    public proxyIconUrl?: string;

}

export interface IMessageEmbedField { name: string, value: string, inline?: boolean }
export class MessageEmbedField {

    constructor(data: IMessageEmbedField) {
        Json.construct(this, data);
    }

    @Json.Property()
    public name!: string;

    @Json.Property()
    public value!: string;

    @Json.Default("inline", false)
    public inline!: boolean;


}

export interface IMessageEmbed {
    title?: string,
    type?: keyof typeof MessageEmbedType,
    description?: string,
    url?: string,
    timestamp?: string | number,
    color?: number,
    footer?: IMessageEmbedFooter,
    image?: IMessageEmbedImage,
    thumbnail?: IMessageEmbedImage,
    video?: IMessageEmbedVideo,
    provider?: IMessageEmbedProvider,
    author?: IMessageEmbedAuthor,
    fields?: IMessageEmbedField[]
}
export class MessageEmbed {

    constructor(data?: IMessageEmbed) {
        if (data)
            Json.construct(this, data);
    }

    @Json.Property()
    public title?: string;
    public setTitle(title: string): MessageEmbed { 
        this.title = title;    
        return this;
    }


    @Json.Property()
    public type?: keyof typeof MessageEmbedType;

    @Json.Property()
    public description?: string;
    public setDescription(description: string): MessageEmbed { 
        this.description = description;    
        return this;
    }

    @Json.Property()
    public url?: string;
    public setURL(url: string): MessageEmbed { 
        this.url = url;    
        return this;
    }

    @Json.Property()
    public timestamp?: number;
    public setTimestamp(): MessageEmbed { 
        this.timestamp = new Date(Date.now()).getTime() 
        return this;
    }

    @Json.Property()
    public color?: ColorResolvable; // create color class with rgb and hex resolved to base 10
    public setColor(color: ColorResolvable): MessageEmbed { 
        this.color = color; 
        return this;
    }

    @Json.ResolveFunction("footer", (footer: IMessageEmbedFooter | undefined) => footer ? new MessageEmbedFooter(footer) : undefined)
    public footer?: MessageEmbedFooter;
    public setFooter(footer: IMessageEmbedFooter | MessageEmbedFooter): MessageEmbed {
        if (footer.constructor.name == MessageEmbedFooter.name) this.footer = footer;
        else this.footer = new MessageEmbedFooter(footer);
        return this;
    }

    @Json.ResolveFunction("image", (image: IMessageEmbedImage | undefined) => image ? new MessageEmbedImage(image) : undefined)
    public image?: MessageEmbedImage;
    public setImage(image: IMessageEmbedImage | MessageEmbedImage): MessageEmbed {
        if (image.constructor.name == MessageEmbedImage.name) this.image = image;
        else this.image = new MessageEmbedImage(image);
        return this;
    }

    @Json.ResolveFunction("thumbnail", (thumbnail: IMessageEmbedImage | undefined) => thumbnail ? new MessageEmbedImage(thumbnail) : undefined)
    public thumbnail?: MessageEmbedImage;
    public setThumbnail(thumbnail: IMessageEmbedImage | MessageEmbedImage): MessageEmbed {
        if (thumbnail.constructor.name == MessageEmbedImage.name) this.thumbnail = thumbnail;
        else this.thumbnail = new MessageEmbedImage(thumbnail);
        return this;
    }

    @Json.ResolveFunction("video", (video: IMessageEmbedVideo | undefined) => video ? new MessageEmbedVideo(video) : undefined)
    public video?: MessageEmbedVideo;
    public setVideo(video: IMessageEmbedVideo | MessageEmbedVideo): MessageEmbed {
        if (video.constructor.name == MessageEmbedVideo.name) this.video = video;
        else this.video = new MessageEmbedVideo(video);
        return this;
    }

    @Json.ResolveFunction("provider", (provider: IMessageEmbedProvider | undefined) => provider ? new MessageEmbedProvider(provider) : undefined)
    public provider?: MessageEmbedProvider;
    public setProvider(provider: IMessageEmbedProvider | MessageEmbedProvider): MessageEmbed {
        if (provider.constructor.name == MessageEmbedProvider.name) this.provider = provider;
        else this.provider = new MessageEmbedProvider(provider);
        return this;
    }

    @Json.ResolveFunction("author", (author: IMessageEmbedAuthor | undefined) => author ? new MessageEmbedAuthor(author) : undefined)
    public author?: MessageEmbedAuthor;
    public setAuthor(author: IMessageEmbedAuthor | MessageEmbedAuthor): MessageEmbed {
        if (author.constructor.name == MessageEmbedAuthor.name) this.author = author;
        else this.author = new MessageEmbedAuthor(author);
        return this;
    }


    @Json.ResolveFunction("fields", (fields: IMessageEmbedField[]) => { 
        if (fields && fields.length >= 0) {
            let resolved: MessageEmbedField[] = [];
            for (let field of fields)
                resolved.push(new MessageEmbedField(field));
            return resolved;
        } else return undefined;
    })
    public fields: MessageEmbedField[] = [];
    public addField(field: IMessageEmbedField | MessageEmbedField): MessageEmbed {
        if (this.fields.length < 25)
            if (field.constructor.name == MessageEmbedField.name) this.fields.push(<MessageEmbedField>field);
            else this.fields.push(new MessageEmbedField(field));
        return this;
    }

    public toJson(): Partial<IMessageEmbed> {
        let base: Partial<IMessageEmbed> = Object.create({});

        base.title = this.title;
        base.type = this.type;
        base.description = this.description;
        base.url = this.url;
        base.timestamp = this.timestamp;
        base.color = this.color ? Color.resolve(this.color) : undefined;

        base.footer = this.footer ? Json.serialize<IMessageEmbedFooter>(this.footer) : undefined;
        base.image = this.image ? Json.serialize(this.image) : undefined;
        base.thumbnail = this.thumbnail ? Json.serialize(this.thumbnail) : undefined;
        base.video = this.video ? Json.serialize(this.video) : undefined;
        base.provider = this.provider ? Json.serialize(this.provider) : undefined;
        base.author = this.author ? Json.serialize(this.author) : undefined;
        base.fields = this.fields.map((value: MessageEmbedField) => Json.serialize(value));

        return base;
    }

    [key: string]: string | number | MessageEmbedAuthor | MessageEmbedField[] | MessageEmbedFooter | MessageEmbedImage | MessageEmbedProvider | MessageEmbedVideo | undefined | Function | ColorResolvable

}

