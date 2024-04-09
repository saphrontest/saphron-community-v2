import { Flex, MenuItem, Text } from "@chakra-ui/react";
import { FC, Fragment } from "react";

const CommunitySelectItem: FC<{ name: string, onClick: () => void }> = ({
    name, onClick
}) => {
    return (
        <MenuItem
            width="100%"
            fontSize="10pt"
            fontWeight={600}
            _hover={{ bg: "gray.100" }}
            onClick={onClick}
        >
            <Flex alignItems="center">{name}</Flex>
        </MenuItem>
    )
}



const CommunitySelectSegment: FC<{
    communities: any[]; onItemClick: (comm: any) => void; title: string;
}> = ({
    communities, onItemClick, title
}) => {
        return (
            <>
                {!!communities.length ? <Text
                    pl={3}
                    mb={1}
                    fontSize="7pt"
                    fontWeight={500}
                    color="gray.500"
                >
                    {title}
                </Text> : null}
                {communities.map(comm => {
                    return (
                        <Fragment key={comm.id}>
                            <CommunitySelectItem
                                name={comm.name}
                                onClick={() => onItemClick(comm)}
                            />
                        </Fragment>
                    )
                })}
            </>
        )
    }

export default CommunitySelectSegment