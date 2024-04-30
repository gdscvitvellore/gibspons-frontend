"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface organisation {
  id: number;
  name: string;
  industry: string;
  location: string;
  invite_code: string;
  logo: string;
  total_money_raised: number;
}

interface organisationStore {
  org: organisation;
  getOrganisation: () => organisation;
  updateOrganisation: (_props: organisation) => void;
}

export const organisationStore = create<organisationStore>()(
  persist(
    (set, get) => ({
      org: {
        id: 0,
        name: "",
        industry: "",
        location: "",
        invite_code: "",
        logo: "",
        total_money_raised: 0,
      },
      getOrganisation: () => {
        return {
          id: get().org.id,
          name: get().org.name,
          industry: get().org.industry,
          location: get().org.location,
          invite_code: get().org.invite_code,
          logo: get().org.logo,
          total_money_raised: get().org.total_money_raised,
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
