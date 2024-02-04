import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  UseDisclosureReturn,
  useTheme,
} from '@chakra-ui/react';
import {AppContext} from '@sqlrooms/components';
import {DuckQueryError} from '@sqlrooms/duckdb';
import {useProjectStore} from '@sqlrooms/project-builder';
import {VALID_TABLE_OR_COLUMN_REGEX} from '@sqlrooms/project-config';
import {FC, FormEvent, useCallback, useContext} from 'react';
import {FieldError, useForm} from 'react-hook-form';

type Props = {
  query: string;
  disclosure: UseDisclosureReturn;
};

type FormData = {
  tableName: string;
  query: string;
  formError?: string;
};

const CreateTableModal: FC<Props> = (props) => {
  const {disclosure} = props;
  const theme = useTheme();
  const {register, handleSubmit, formState, setError, clearErrors, reset} =
    useForm<FormData>({values: {tableName: '', query: props.query.trim()}});
  const {errors, isSubmitting} = formState;

  const addQuery = useProjectStore((state) => state.addSqlQuery);

  const onSubmit = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      clearErrors('formError');
      handleSubmit(async (data: FormData) => {
        try {
          const {tableName, query} = data;
          await addQuery(tableName, query);
          reset();
          disclosure.onClose();
        } catch (err) {
          setError('formError', {
            type: 'manual',
            message:
              err instanceof DuckQueryError
                ? err.getMessageForUser()
                : `${err}`,
          });
        }
      })(ev);
    },
    [addQuery, clearErrors, disclosure, handleSubmit, reset, setError],
  );
  const appContext = useContext(AppContext);

  return (
    <Modal
      // isCentered
      size="2xl"
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      closeOnOverlayClick={false}
      preserveScrollBarGap={appContext.mode === 'sdk'} // to avoid layout jumping and CSS added to host document
    >
      <ModalOverlay backdropFilter={theme.backdropFilter} />
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>
            Create table
            <Text fontSize="xs" color="gray.300" fontWeight="normal">
              Create a new table from the results of an SQL query.
              {/* Add a new query to the project data sources */}
              {/* The table will be recreated each time when the project is opened. */}
            </Text>
          </ModalHeader>
          <ModalBody display="flex" flexDir="column" gap="2">
            <FormControl isInvalid={Boolean(errors.formError)}>
              <FormErrorMessage>
                <Alert status="error" borderRadius={4} mb={6}>
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    {(errors.formError as FieldError)?.message}
                  </AlertDescription>
                </Alert>
              </FormErrorMessage>
            </FormControl>

            <FormControl id="tableName" isInvalid={Boolean(errors.tableName)}>
              <FormLabel>Table name:</FormLabel>
              <Input
                size="sm"
                fontSize="sm"
                fontFamily="mono"
                autoFocus
                {...register('tableName', {
                  required: 'Table name is required',
                  pattern: {
                    value: VALID_TABLE_OR_COLUMN_REGEX,
                    message:
                      'Only letters, digits and underscores are allowed; should not start with a digit',
                  },
                })}
              />
              <FormErrorMessage>{errors.tableName?.message}</FormErrorMessage>
            </FormControl>

            <FormControl id="query" isInvalid={Boolean(errors.query)}>
              <FormLabel>SQL query:</FormLabel>
              <Textarea
                size="sm"
                fontSize="xs"
                fontFamily="mono"
                color="gray.100"
                bg="gray.800"
                rows={10}
                {...register('query', {required: 'Query is required'})}
              />
              <FormErrorMessage>{errors.query?.message}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={3}
              onClick={disclosure.onClose}
              // isDisabled={Boolean(loadingStatus)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              type="submit"
              isLoading={isSubmitting}
              // onClick={handleConfirm}
              // isDisabled={Boolean(loadingStatus) || !canConfirm}
            >
              Create
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateTableModal;
