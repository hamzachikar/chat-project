import { Compte } from '../compte/compte';
import { Msg } from '../message/msg';

export class Conversation {
    public id:Number;
    public contact1:Compte;
    public contact2:Compte;
    public status:string;
    public active:boolean;
    constructor(){}
}