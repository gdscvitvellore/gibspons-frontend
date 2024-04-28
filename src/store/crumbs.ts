import { create } from "zustand";

export interface link {
    href: string;
    title: string;
}

export interface linksStore {
    links: link[];
    setLink: (links: link[]) => void;
    getLink: () => link[];
}

export const useLinkStore = create<linksStore>((set, get) => ({
    links: [],
    setLink: (links) => {
        set({ links });
    },
    getLink: () => {
        return get().links;
    },
}));