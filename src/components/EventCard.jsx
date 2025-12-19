import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Image,
  Text,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useData } from "../context/DataContext.jsx";

function fmt(s) {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s ?? "-";
  }
}

export default function EventCard({ ev }) {
  const { categoryMap } = useData();
  const names = (ev.categoryIds || [])
    .map((id) => categoryMap.get(id))
    .filter(Boolean);

  return (
    <Card as={RouterLink} to={`/events/${ev.id}`} _hover={{ boxShadow: "lg" }}>
      <CardHeader>
        <Heading size="md">{ev.title}</Heading>
      </CardHeader>
      <CardBody>
        {ev.image && (
          <Image
            src={ev.image}
            alt={ev.title}
            mb={3}
            borderRadius="md"
            objectFit="cover"
            maxH="220px"
            w="100%"
          />
        )}
        <Text noOfLines={3} mb={2}>
          {ev.description}
        </Text>
        <Text>
          <b>Start:</b> {fmt(ev.startTime)}
        </Text>
        <Text mb={2}>
          <b>End:</b> {fmt(ev.endTime)}
        </Text>
        <HStack wrap="wrap">
          {names.map((n) => (
            <Tag key={n}>{n}</Tag>
          ))}
        </HStack>
      </CardBody>
    </Card>
  );
}
