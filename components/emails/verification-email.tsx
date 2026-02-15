import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { siteConfig } from "@/lib/metadata";

interface VerificationEmailProps {
  url: string;
  userName?: string;
}

export const VerificationEmail = ({
  url,
  userName,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address - {siteConfig.name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={greeting}>Hi {userName || "there"},</Text>
          <Text style={paragraph}>
            Thanks for starting the new {siteConfig.name} account! We want to make sure it&apos;s really you. 
            Please click the button below to verify your email address.
          </Text>
          <Button style={button} href={url}>
            Verify Email
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
          <Text style={footer}>{siteConfig.name}, {siteConfig.contact.address}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const greeting = {
  fontSize: "16px",
  lineHeight: "26px",
  fontWeight: "bold",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#484848",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
  marginTop: "20px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

export default VerificationEmail;
