"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface organisation {
  id: number | null;
  name: string;
  industry: string;
  location: string;
  invite_code: string;
  logo: string;
}

interface organisationStore {
  org: organisation;
  getOrganisation: () => organisation;
  updateOrganisation: (props: organisation) => void;
}

export const organisationStore = create<organisationStore>()(
  persist(
    (set, get) => ({
      org: {
        id: null,
        name: "",
        industry: "",
        location: "",
        invite_code: "",
        logo: "",
      },
      getOrganisation: () => {
        return {
          id: get().org.id,
          name: get().org.name,
          industry: get().org.industry,
          location: get().org.location,
          invite_code: get().org.invite_code,
          logo: get().org.logo,
        };
      },
      updateOrganisation: (props: organisation) => {
        set({ org: { ...props } });
      },
    }),
    {
      name: "organisation",
    }
  )
);
