import { Image } from '../image/image';


export class Contact {
    public id:Number;
    public nom:string;
    public prenom:string;
    public sexe:string;
    public dateNaissance:Date;
    public cin:string;
    public civilite:string;
    public situation:string;
    public groupe:string;
    public imageModel:Image;
    constructor(){}
}
