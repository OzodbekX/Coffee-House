import React from "react";
import { CartProvider } from "./CartContext";
import { ThemeProvider } from "./ThemeContext";
import { LanguageProvider } from "./LanguageContext";
import { UserProvider } from "./UserContext";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <LanguageProvider>
    <ThemeProvider>
      <UserProvider>
        <CartProvider>{children}</CartProvider>
      </UserProvider>
    </ThemeProvider>
  </LanguageProvider>
);
