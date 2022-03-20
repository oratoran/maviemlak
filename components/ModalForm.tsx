import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { FormattedMessage } from "react-intl";

export const ModalForm = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const initialValues = {
    name: "",
    email: "",
    phone: '',
    message: ''
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent p="8">
        <Text mb="8" fontSize="lg">
          <FormattedMessage
            id="inquiryFormDescription"
            defaultMessage="Send inquiry"
          />
        </Text>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            ...props
          }) => (
            <form>
              <FormControl isInvalid={!!(errors.name && touched.name)} isRequired>
                <FormLabel htmlFor="name">
                  <FormattedMessage id="form.name" defaultMessage={"Name"} />
                </FormLabel>
                <Input
                  name="name"
                  id="name"
                  value={values.name}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!(errors.email && touched.email)} mt="4" isRequired>
                <FormLabel htmlFor="email">
                  <FormattedMessage id="form.email" defaultMessage={"Email"} />
                </FormLabel>
                <Input
                  name="email"
                  id="email"
                  value={values.email}
                  onChange={handleChange}
                  type="email"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!(errors.phone && touched.phone)} mt="4">
                <FormLabel htmlFor="phone">
                  <FormattedMessage id="form.phone" defaultMessage={"Phone"} />
                </FormLabel>
                <Input
                  name="phone"
                  id="phone"
                  value={values.phone}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!(errors.message && touched.message)} mt="4" isRequired>
                <FormLabel htmlFor="message">
                  <FormattedMessage id="form.message" defaultMessage={"Message"} />
                </FormLabel>
                <Textarea
                  name="message"
                  id="message"
                  value={values.message}
                  onChange={handleChange}
                />
                <FormErrorMessage>{errors.message}</FormErrorMessage>
              </FormControl>
              <Button
                mt={8}
                colorScheme="blue"
                isLoading={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
