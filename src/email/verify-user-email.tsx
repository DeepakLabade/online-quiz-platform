import {
    Html,
    Head,
    Body,
    Container,
    Text,
    Heading,
    Tailwind,
  } from "@react-email/components";
  
  export function verifyUserEmail({
    username,
    OTP,
  }: {
    username: string;
    OTP: string;
  }) {
    return (
      <Html>
        <Head />
        <Tailwind>
          <Body className="bg-gray-100 font-sans">
            <Container className="mx-auto my-10 max-w-md rounded-lg bg-white p-8 shadow">
              <Heading className="mb-4 text-2xl font-bold text-gray-900">
                Verify your email
              </Heading>
  
              <Text className="text-sm text-gray-700">
                Hi <span className="font-semibold">{username}</span>,
              </Text>
  
              <Text className="mt-3 text-sm leading-6 text-gray-700">
                Welcome to <span className="font-semibold">online-Quiz</span>!
                To complete your signup, please use the verification code below:
              </Text>
  
              <div className="my-6 rounded-md bg-gray-50 py-4 text-center">
                <Text className="text-3xl font-bold tracking-widest text-gray-900">
                  {OTP}
                </Text>
              </div>
  
              <Text className="text-sm text-gray-700">
                This code is valid for{" "}
                <span className="font-semibold">1 hour</span>. Please do not share
                it with anyone.
              </Text>
  
              <Text className="mt-6 text-xs text-gray-500">
                If you didn’t create this account, you can safely ignore this
                email.
              </Text>
  
              <Text className="mt-4 text-sm font-medium text-gray-900">
                — The online-quiz Team
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }
  