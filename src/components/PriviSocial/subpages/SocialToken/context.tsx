import React from "react";

type ContextType = {
  selectedPerk: any | null;
  setSelectedPerk: (state: any | null) => void;
};

const SocialTokenContext: React.Context<ContextType> = React.createContext<ContextType>({
  selectedPerk: null,
  setSelectedPerk: () => {},
});

export default SocialTokenContext;
