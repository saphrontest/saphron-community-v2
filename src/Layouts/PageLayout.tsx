import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Modal, Nav } from "../Components";

interface PageLayoutProps {
  children: React.ReactElement[] | React.ReactElement
  maxWidth?: string;
  isNav?: boolean;
  askAuth?: boolean;
}

// Assumes array of two children are passed
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth,
  isNav = true,
}) => {
  return (
    <>
      {isNav ? <Nav /> : null}
      <Flex justify="center" p="16px 0px">
        <Flex width="95%" justify="center" maxWidth={maxWidth || "860px"}>
          <Flex
            direction="column"
            width={{ base: "100%", md: "65%" }}
            mr={{ base: 0, md: 6 }}
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