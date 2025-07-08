import { createContext, useContext } from 'react';

export const ProfileDrawerContext = createContext({
  openProfileDrawer: () => {},
});

export const useProfileDrawer = () => useContext(ProfileDrawerContext);
