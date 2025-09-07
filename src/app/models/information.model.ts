export interface Information {
    id?: number;
    type: InformationType;
    value: string;
    tags: string[];
    userId?: number;
}

export enum InformationType {
    COMMAND = 'COMMAND',
    LINK = 'LINK',
    PROCEDURE = 'PROCEDURE',
    CONTACT = 'CONTACT',
    CREDENTIAL = 'CREDENTIAL'
}

export interface InformationRequest {
    type: InformationType;
    value: string;
    tags: string[];
}
