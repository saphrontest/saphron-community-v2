import React from 'react'
import { PageLayout } from '../Layouts'
import { Meta } from '../Components'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex, Text } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'

const Policies = () => {
    const location = useLocation().pathname.split('/')[1]
    return (
        <PageLayout showWorkshops={true} showGroupChats={true} leftWidth='100%'>
            <Flex bg="white" width="100%" direction="column" textAlign="left" fontSize={"18px"} height="calc(100vh - 100px)">
                <Meta
                    title='Saphron Health | Privacy & Policy'
                    description='A self-help platform for neurodivergent adults to manage their health & wellness.'
                />
                <Accordion defaultIndex={location === "privacy-policy" ? [0] : [1]} allowToggle>
                    <AccordionItem>
                        <h2>
                            <AccordionButton bg="gray.100">
                                <Box as="span" display="flex" justifyContent="space-between" flex='1' textAlign='left' fontWeight={600} fontSize={["16px", "18px", "20px", "24px"]} pr="2rem">
                                    <Text>Privacy Policy</Text>
                                    <Text fontWeight={700}>08.03.2024</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} overflowY="scroll" height="calc(100vh - 220px)">
                            <Text>
                                Thank you for using Saphron Health! This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you use our health and wellbeing app. By using Saphron Health, you agree to the terms and practices described in this policy.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                1. Information We Collect
                            </Text>
                            <Text>
                                <strong>1.1 Personal Information:</strong><br /> We may collect personal information such as your name, email address, date of birth, gender, and other relevant details when you register and use our app.
                            </Text>
                            <Text>
                                <strong>1.2 Health Data:</strong><br /> Saphron Health may collect and store health-related data, including but not limited to activity levels, sleep patterns, heart rate, and other metrics to provide you with personalized health insights.
                            </Text>
                            <Text>
                                <strong>1.3 Device Information:</strong><br /> We may collect information about the device you use to access Saphron Health, including device type, operating system, and unique device identifiers.
                            </Text>
                            <Text>
                                <strong>1.4 Usage Data:</strong><br /> We may collect information about how you interact with our app, including the features you use, the content you view, and your interactions with notifications.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                2. How We Use Your Information
                            </Text>
                            <Text>
                                <strong>2.1 Provide Services:</strong><br /> We use the collected information to deliver and enhance the features and services offered by Saphron Health, including personalized health recommendations and insights.
                            </Text>
                            <Text>
                                <strong>2.2 Communication:</strong><br /> We may use your contact information to send you important updates, newsletters, and marketing materials. You can opt-out of these communications at any time.
                            </Text>
                            <Text>
                                <strong>2.3 Aggregate Data:</strong><br /> We may aggregate and anonymize data to analyze usage patterns, improve our services, and conduct research for the benefit of public health. Aggregated data will not personally identify you.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                3. Data Sharing
                            </Text>
                            <Text>
                                <strong>3.1 Third-Party Service Providers:</strong><br /> We may share your information with third-party service providers who assist us in delivering and improving our services. These providers are bound by confidentiality agreements and are only authorized to use your information for specified purposes.
                            </Text>
                            <Text>
                                <strong>3.2 Legal Compliance:</strong><br /> We may disclose your information if required by law or in response to a valid legal request.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                4. Security
                            </Text>
                            <Text>
                                We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                5. Your Choices
                            </Text>
                            <Text>
                                You have the right to access, correct, or delete your personal information. You can manage your communication preferences and opt-out of certain data processing activities.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                6. Changes to This Privacy Policy
                            </Text>
                            <Text>
                                We may update this Privacy Policy from time to time. Any changes will be effective upon posting the updated policy on our website or within the app. We encourage you to review this policy periodically.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                7. Contact Us
                            </Text>
                            <Text>
                                If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at <strong>app@saphronhealth.com</strong>.
                            </Text>
                        </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                        <h2>
                            <AccordionButton bg="gray.100">
                                <Box as="span" display="flex" justifyContent="space-between" flex='1' textAlign='left' fontWeight={600} fontSize={["16px", "18px", "20px", "24px"]} pr="2rem">
                                    <Text>Terms & Conditions</Text>
                                    <Text fontWeight={700}>08.03.2024</Text>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4} overflowY="scroll" height="calc(100vh - 220px)">
                            <Text>
                                Welcome to Saphron Health! These terms and conditions ("Terms") govern your access to and use of the Saphron Health mobile application and related services (collectively, the "App"). By using Saphron Health, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use the App.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                1. Use of the App
                            </Text>
                            <Text>
                                <strong>1.1 Eligibility:</strong><br /> You must be at least 18 years old to use Saphron Health. By using the App, you represent and warrant that you meet this eligibility requirement.
                            </Text>
                            <Text>
                                <strong>1.2 Registration:</strong><br /> To access certain features of the App, you may need to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                            </Text>
                            <Text>
                                <strong>1.3 Account Security:</strong><br /> You are responsible for maintaining the confidentiality of your account login information and for all activities that occur under your account. Notify us immediately if you suspect any unauthorized use of your account.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                2. User Content
                            </Text>
                            <Text>
                                <strong>2.1 Your Content:</strong><br /> You may be able to submit, post, or share content through the App. You retain ownership of any intellectual property rights in such content. By submitting, posting, or sharing content, you grant Saphron Health a non-exclusive, royalty-free, worldwide, perpetual license to use, modify, adapt, reproduce, and distribute such content.
                            </Text>
                            <Text>
                                <strong>2.2 Prohibited Content:</strong><br /> You agree not to submit content that is unlawful, offensive, defamatory, or violates the rights of others. Saphron Health reserves the right to remove or refuse any content for any reason without notice.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                3. Intellectual Property
                            </Text>
                            <Text>
                                <strong>3.1 Ownership:</strong><br /> The App, including its design, features, and content, is owned by Saphron Health and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any part of the App without our prior written consent.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                4. Health Disclaimer
                            </Text>
                            <Text>
                                Saphron Health provides general health and wellbeing information. The App is not a substitute for professional medical advice, diagnosis, or treatment. Consult with a qualified healthcare professional before making any health-related decisions based on information obtained from the App.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                5. Termination
                            </Text>
                            <Text>
                                Saphron Health reserves the right to suspend or terminate your access to the App at any time and for any reason, without notice.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                6. Changes to Terms
                            </Text>
                            <Text>
                                We may update these Terms from time to time. Any changes will be effective upon posting the updated terms within the App. Your continued use of the App after the posting of changes constitutes your acceptance of the revised terms.
                            </Text>
                            <Text fontWeight={700} fontSize="20px" py="1rem">
                                7. Contact Us
                            </Text>
                            <Text>
                                If you have any questions or concerns about these Terms, please contact us at [Your Contact Information].
                            </Text>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Flex>
            <></>
        </PageLayout>
    )
}

export default Policies
