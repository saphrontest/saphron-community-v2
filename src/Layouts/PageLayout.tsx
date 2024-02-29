import React from "react";
import { Box, Flex} from "@chakra-ui/react";
import { SupportGroupsSide, Modal, Nav, Sidebar, WorkshopSide } from "../Components";
import { Capacitor } from '@capacitor/core';

interface PageLayoutProps {
  children: React.ReactElement[] | React.ReactElement
  maxWidth?: string;
  isNav?: boolean;
  showSidebar?: boolean;
  showWorkshops?: boolean;
  leftWidth?: string;
  showGroupChats?: boolean;
}

// Assumes array of two children are passed
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  maxWidth,
  isNav = true,
  showSidebar = true,
  showWorkshops = false,
  showGroupChats = false,
  leftWidth = "65%"
}) => {
  
  return (
    <>
      {isNav ? <Nav /> : null}
      <Flex justify="center" pt="16px" pb={Capacitor.getPlatform() === "ios" ? "32px" : 0} px={{base: "8px"}}> 
        <Flex width="100%" justify="center" maxWidth={maxWidth || "1320px"}>
          {(showSidebar || showWorkshops || showGroupChats) && <Flex direction={"column"} display={{base: 'none', md: 'flex'}} width="20%" gap={"0.5rem"}>
            {showSidebar && <Sidebar />}
            {showWorkshops && <WorkshopSide />}
            {showGroupChats && <SupportGroupsSide />}
          </Flex>}
          <Flex
            direction="column"
            width={{ base: "100%", md: leftWidth }}
            mx={{ base: 0, md: 6 }}
            mt={Capacitor.getPlatform() === "ios" ? "110px" : "0px"}
          >
            {children && children[0 as keyof typeof children]}
          </Flex>
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