export interface BewertungsOption {
    wert: number;
    label: string;
}

export interface Frage {
    frage: string;
    beschreibung: string;
    bewertung: BewertungsOption[];
}

export interface Kategorie {
    kategorie: string;
    fragenliste: Frage[];
}

export interface Fragebogen {
    fragen: Kategorie[];
}

export type AntwortWert = number;

export type Antworten = AntwortWert[];

export interface GewichteteAntwort {
    value: AntwortWert;
    weight: number;
}

export type GewichteteAntworten = GewichteteAntwort[];