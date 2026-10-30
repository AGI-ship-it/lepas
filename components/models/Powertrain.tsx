"use client";

import { ComponentProps, createContext, ReactNode, useContext, useState } from "react";
import FeatureShowcase from "@/components/models/FeatureShowcase";
import HotspotFeature from "@/components/models/HotspotFeature";
import { ModelPowertrain } from "@/lib/types";

type PowertrainState = {
  powertrains: ModelPowertrain[];
  active?: ModelPowertrain;
  setActive: (id: string) => void;
};

const PowertrainContext = createContext<PowertrainState>({ powertrains: [], setActive: () => {} });

/** Shares the selected powertrain (ICE / PHEV) between the hero, performance and safety sections. */
export function PowertrainProvider({
  powertrains = [],
  children,
}: {
  powertrains?: ModelPowertrain[];
  children: ReactNode;
}) {
  const [activeId, setActive] = useState(powertrains[0]?.id);
  const active = powertrains.find((p) => p.id === activeId);
  return (
    <PowertrainContext.Provider value={{ powertrains, active, setActive }}>{children}</PowertrainContext.Provider>
  );
}

export function usePowertrain() {
  return useContext(PowertrainContext);
}

// Remounted per powertrain so the active tab / hotspot resets when the lists change length.

export function PowertrainFeatureShowcase(props: ComponentProps<typeof FeatureShowcase>) {
  const { active } = usePowertrain();
  return <FeatureShowcase key={active?.id} {...props} items={active?.performanceItems ?? props.items} />;
}

export function PowertrainHotspotFeature(props: ComponentProps<typeof HotspotFeature>) {
  const { active } = usePowertrain();
  return <HotspotFeature key={active?.id} {...props} features={active?.highlights ?? props.features} />;
}
