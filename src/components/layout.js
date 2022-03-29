import React, { useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Nav, Social, Email, Footer } from "@components";
import { GlobalStyle, theme } from "@styles";

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = ({ children, location }) => {
  // Sets target="_blank" rel="noopener noreferrer" on external links
  const handleExternalLinks = () => {
    const allLinks = Array.from(document.querySelectorAll("a"));
    if (allLinks.length > 0) {
      allLinks.forEach((link) => {
        if (link.host !== window.location.host) {
          link.setAttribute("rel", "noopener noreferrer");
          link.setAttribute("target", "_blank");
        }
      });
    }
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1); // location.hash without the '#'
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView();
          el.focus();
        }
      }, 0);
    }

    handleExternalLinks();
  }, [location]);

  return (
    <>
      <div id="root">
        <ThemeProvider theme={theme}>
          <GlobalStyle />

          <StyledContent>
            <Nav />
            <Social />
            <Email />

            <div id="content">{children}</div>

            <Footer />
          </StyledContent>
        </ThemeProvider>
      </div>
    </>
  );
};

export default Layout;
