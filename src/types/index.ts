export interface CharacterItem {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  type?: string;
  gender?: string;
}

export interface ApiPayload {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: CharacterItem[];
}

export type RootStackParamList = {
  Home: undefined;
  Details: { character: CharacterItem };
  Settings: undefined;
};

