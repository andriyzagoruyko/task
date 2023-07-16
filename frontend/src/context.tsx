import React, { createContext, useContext, useState } from "react";
import { IAsset } from "./components/AssetCard";

interface IAppContextState {
  assets: IAsset[];
  setAssets: (assets: IAsset[]) => void;
}

const INITIAL_STATE: IAppContextState = {
  assets: [],
  setAssets: (assets: IAsset[]) => {},
};

export const AppContext = createContext<IAppContextState>(INITIAL_STATE);

export const AppContextProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [assets, setAssets] = useState<IAsset[]>([]);
  return (
    <AppContext.Provider value={{ assets, setAssets }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext)