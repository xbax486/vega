import { KeyValuePair } from "./KeyValuePair";
import { Contact } from "./contact";

export interface Vehicle {
    id: number;
    makeResource: KeyValuePair;
    modelResource: KeyValuePair;
    isRegistered: boolean;
    featureResources: KeyValuePair[],
    contactResource: Contact;
    lastUpdated: string;
}

