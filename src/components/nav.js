import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import { navLinks } from "@config";
import { Menu } from "@components";
import { IconLogo } from "@components/icons";

const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0px 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: rgba(10, 25, 47, 0.85);
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 40px;
  }
  @media (max-width: 768px) {
    padding: 0 25px;
  }
`;

const StyledNav = styled.nav`
  ${({ theme }) => theme.mixins.flexBetween};
  position: relative;
  width: 100%;
  color: var(--lightest-slate);
  font-family: var(--font-mono);
  counter-reset: item 0;
  z-index: 12;

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};

    a {
      color: var(--orange);

      h3 {
        margin: 0;
        color: var(--orange);
      }

      &:hover,
      &:focus {
        svg {
          fill: var(--orange-tint);
        }
      }

      svg {
        fill: none;
        transition: var(--transition);
        user-select: none;
      }
    }
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    ${({ theme }) => theme.mixins.flexBetween};
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 5px;
      position: relative;
      counter-increment: item 1;
      font-size: var(--fz-xs);

      a {
        padding: 10px;

        &:before {
          content: "0" counter(item) ".";
          margin-right: 5px;
          color: var(--orange);
          font-size: var(--fz-xxs);
          text-align: right;
        }
      }
    }
  }

  .blog-button {
    ${({ theme }) => theme.mixins.smallButton};
    margin-left: 15px;
    font-size: var(--fz-xs);
  }
`;

const Nav = () => {
  const Logo = (
    <div className="logo" tabIndex="-1">
      <a href="/" aria-label="home">
        <h3>tonystrawberry.codes</h3>
      </a>
    </div>
  );

  const ResumeLink = (
    <Link className="blog-button" to="/journal">
      Blog
    </Link>
  );

  return (
    <StyledHeader>
      <StyledNav>
        <>{Logo}</>
        <StyledLinks>
          <ol>
            {navLinks &&
              navLinks.map(({ url, name }, i) => (
                <li key={i}>
                  <Link to={url}>{name}</Link>
                </li>
              ))}
          </ol>

          {ResumeLink}
        </StyledLinks>

        <Menu />
      </StyledNav>
    </StyledHeader>
  );
};

export default Nav;
