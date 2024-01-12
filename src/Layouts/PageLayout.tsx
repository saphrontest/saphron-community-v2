import React, { Fragment } from "react";
import { Box, Divider, Flex, Link, List, Text, useMediaQuery } from "@chakra-ui/react";
import { Modal, Nav, Sidebar } from "../Components";

interface PageLayoutProps {
  children: React.ReactElement[] | React.ReactElement
  maxWidth?: string;
  isNav?: boolean;
  showSidebar?: boolean;
}



// Assumes array of two children are passed
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth,
  isNav = true,
  showSidebar = true
}) => {
  
  return (
    <>
      {isNav ? <Nav /> : null}
      <Flex justify="center" pt="16px" px={{base: "8px"}}>
        <Flex width="100%" justify="center" maxWidth={maxWidth || "1320px"}>
          {showSidebar && <Sidebar />}
          <Flex
            direction="column"
            width={{ base: "100%", md: "65%" }}
            mx={{ base: 0, md: 6 }}
          >
            {children && children[0 as keyof typeof children]}
          </Flex>
          {/* Right Layout */}
          <Box
            display={{ base: "none", md: "flex" }}
            flexDirection="column"
            flexGrow={1}
          >
            {children && children[1 as keyof typeof children]}
          </Box>
        </Flex>
      </Flex>
      <Modal />
    </>
  );
};

export default PageLayout;