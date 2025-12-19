import { useState } from "react";
import { Box, Heading, Text, Input, Button, VStack } from "@chakra-ui/react";

const API_URL = "http://localhost:3000";

export default function NewsletterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    if (!name.trim() || !email.trim()) {
      return "Vul alle verplichte velden in.";
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return "Vul een geldig e-mailadres in.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Newsletter HTTP ${res.status}`);
      }

      setSuccessMsg("Je bent succesvol aangemeld voor de nieuwsbrief!");
      setName("");
      setEmail("");
    } catch (e) {
      setErrorMsg("Aanmelden mislukt: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={3}>
        Meld je aan voor de nieuwsbrief
      </Heading>
      <Text mb={4} fontSize="sm" color="gray.600">
        Ontvang updates over nieuwe events, speciale acties en nieuws rondom de
        Event Planner.
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={3}>
          {errorMsg && (
            <Box
              bg="red.50"
              borderRadius="md"
              border="1px solid #fecaca"
              p={2}
              fontSize="sm"
              color="red.700"
            >
              {errorMsg}
            </Box>
          )}
          {successMsg && (
            <Box
              bg="green.50"
              borderRadius="md"
              border="1px solid #bbf7d0"
              p={2}
              fontSize="sm"
              color="green.700"
            >
              {successMsg}
            </Box>
          )}

          <Box>
            <Text fontSize="sm" mb={1}>
              Naam*
            </Text>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Je naam"
              size="sm"
            />
          </Box>

          <Box>
            <Text fontSize="sm" mb={1}>
              E-mailadres*
            </Text>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              size="sm"
            />
          </Box>

          <Button
            type="submit"
            colorScheme="teal"
            size="sm"
            isLoading={submitting}
            alignSelf="flex-start"
          >
            Aanmelden
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
