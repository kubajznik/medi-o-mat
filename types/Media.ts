export type MediaCode = string;

export type MediaCodierung = Record<string, number>;

export interface Media {
	name: string;
	mediumArt: string;
	beschreibung: string;
	url: string;
	spotifyUrl?: string;
	image: string;
	code: MediaCode;
	codierung: MediaCodierung;
}

export type MediaResults = Record<MediaCode, number>;

export type MediaList = Media[];
