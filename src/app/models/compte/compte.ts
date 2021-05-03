import { Roles } from '../roles/role';
import { Contact } from '../contact/contact';

export class Compte {
    id: number;
    username: string;
    password: string;
    active:boolean;
    roles:Roles[];
    contact:Contact;
    jwt?: string;
    constructor(){}
}
