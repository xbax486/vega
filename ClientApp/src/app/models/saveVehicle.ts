import { KeyValuePair } from "./KeyValuePair";
import { Contact } from "./contact";

export interface SaveVehicle {
    id: number;
    makeId: number;
    modelId: number;
    isRegistered: boolean;
    vehicleFeatureIds: number[],
    contactResource: Contact;
}