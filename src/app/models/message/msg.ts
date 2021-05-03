import { Compte } from '../compte/compte';
import { Conversation } from '../conversation/conversation';

export class Msg {
    public id:number;
    public msg:string;
    public dateSent:Date;
    public fromContact:Compte;
    public toContact:Compte;
    public status:boolean;
    public type:string;
    public cvr:Conversation;
    constructor(){}
}
