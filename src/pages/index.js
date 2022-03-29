import React from "react";
import styled from "styled-components";
import { Layout } from "@components";

const StyledMainContainer = styled.main`
  counter-reset: section;
`;

const IndexPage = ({ location }) => (
  <Layout location={location}>
    <StyledMainContainer className="fillHeight"></StyledMainContainer>
  </Layout>
);

export default IndexPage;
