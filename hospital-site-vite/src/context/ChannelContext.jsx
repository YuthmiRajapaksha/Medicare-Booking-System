import { createContext, useState } from "react";

export const ChannelContext = createContext();

export const ChannelProvider = ({ children }) => {
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  return (
    <ChannelContext.Provider value={{ appointmentsCount, setAppointmentsCount }}>
      {children}
    </ChannelContext.Provider>
  );
};