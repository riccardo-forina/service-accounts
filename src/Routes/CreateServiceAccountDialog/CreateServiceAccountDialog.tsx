import {
  Bullseye,
  Button,
  Checkbox,
  ClipboardCopy,
  EmptyState,
  EmptyStateIcon,
  Form,
  FormGroup,
  FormProps,
  InputGroup,
  InputGroupText,
  Modal,
  ModalVariant,
  Popover,
  Text,
  TextContent,
  TextInput,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { HelpIcon, KeyIcon } from '@patternfly/react-icons';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { VoidFunctionComponent, useEffect, useState } from 'react';
import { AppLink } from '../../Components/AppLink';
import { NewServiceAccount } from '../../types';
import { createServiceAccount } from './createServiceAccount';

const FORM_ID = 'service-account-form';
const MAX_SERVICE_ACCOUNT_NAME_LENGTH = 32;
const HELPER_TEXT = {
  'empty-name':
    'Must start with a letter and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).',
  'invalid-format':
    'Must start with a letter and end with a letter or number. Valid characters include lowercase letters from a to z, numbers from 0 to 9, and hyphens ( - ).',
  'invalid-length': `Cannot exceed ${MAX_SERVICE_ACCOUNT_NAME_LENGTH} characters.`,
};

const appendTo = () => document.getElementById('chrome-app-render-root')!;

const CreateServiceAccountDialog = () => {
  const queryClient = useQueryClient();
  const { auth, getEnvironmentDetails } = useChrome();

  const mutation = useMutation({
    mutationFn: createServiceAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-accounts'] });
    },
  });
  const onSubmit: Step1Props['onSubmit'] = async (name) => {
    const env = getEnvironmentDetails();
    const token = await auth.getToken();
    mutation.mutate({ name, token, sso: env.sso });
  };

  return mutation.data === undefined ? (
    <Step1 onSubmit={onSubmit} />
  ) : (
    <Step2 serviceAccount={mutation.data} />
  );
};
type Step1Props = { onSubmit: (name: string) => void };
const Step1: VoidFunctionComponent<Step1Props> = ({ onSubmit }) => {
  useEffect(() => {
    insights?.chrome?.appAction?.('create-service-account-page');
  }, []);
  const [validate, setValidate] = useState(false);
  const [name, setName] = useState('');

  const validity = (() => {
    //validate required field
    if (name === undefined || name.trim() === '') {
      return 'empty-name' as const;
    } else if (!/^[a-z]([-a-z0-9]*[a-z0-9])?$/.test(name.trim())) {
      return 'invalid-format' as const;
    }
    //validate max length
    else if (name.length > MAX_SERVICE_ACCOUNT_NAME_LENGTH) {
      return 'invalid-length' as const;
    }
    return 'valid' as const;
  })();

  const validated = validate && validity !== 'valid' ? 'error' : undefined;

  const doValidate = () => {
    setValidate(true);
  };

  const handleSubmit: FormProps['onSubmit'] = (ev) => {
    ev.preventDefault();
    setValidate(true);
    if (validity === 'valid') {
      onSubmit(name);
    }
  };

  return (
    <Modal
      id="modalCreateServiceAccountStep1"
      variant={ModalVariant.medium}
      title={'Create a service account'}
      isOpen={true}
      ouiaId={'modal-create-service-account'}
      appendTo={appendTo}
      showClose={false}
      actions={[
        <Button key="create" variant="primary" type={'submit'} form={FORM_ID}>
          Create
        </Button>,
        <Button
          key="cancel"
          variant="link"
          component={(props) => <AppLink {...props} to={''} />}
        >
          Cancel
        </Button>,
      ]}
    >
      <Form onSubmit={handleSubmit} id={FORM_ID} disabled={!validity}>
        <FormGroup
          label={'Short description'}
          isRequired
          fieldId="short-description-field"
          helperTextInvalid={
            validity !== 'valid' ? HELPER_TEXT[validity] : undefined
          }
          validated={validated}
          helperText={HELPER_TEXT['invalid-format']}
          labelIcon={
            <Popover
              headerContent={
                <div>{'serviceAccount.short_description_popover_title'}</div>
              }
              bodyContent={
                <div>{'serviceAccount.short_description_popover_body'}</div>
              }
            >
              <button
                aria-label={'serviceAccount.short_description_popover_button'}
                aria-describedby="short-description-field"
                className="pf-c-form__group-label-help"
                type={'button'}
                onClick={(e) => e.preventDefault()}
              >
                <HelpIcon noVerticalAlign />
              </button>
            </Popover>
          }
        >
          <TextInput
            isRequired
            type="text"
            id="text-input-short-description"
            name="text-input-short-description"
            value={name}
            onChange={setName}
            onBlur={doValidate}
            validated={validated}
            autoFocus={true}
            ouiaId={'text-input'}
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};

const Step2: VoidFunctionComponent<{ serviceAccount: NewServiceAccount }> = ({
  serviceAccount,
}) => {
  const [confirmationCheckbox, confirm] = useState(false);
  return (
    <Modal
      id="modalCreateServiceAccountStep2"
      variant={ModalVariant.medium}
      title={''}
      isOpen={true}
      appendTo={appendTo}
      ouiaId={'modal-CredentialsSuccess'}
      showClose={false}
    >
      <EmptyState>
        <EmptyStateIcon icon={KeyIcon} />
        <Title headingLevel="h2" size="lg">
          Credentials successfully generated
        </Title>
        <TextContent>
          <Text component={TextVariants.small} className="pf-u-mt-lg">
            Connect to the Kafka instance using this client ID and secret
          </Text>
        </TextContent>
        <InputGroup className="pf-u-mt-lg">
          <InputGroupText className="pf-u-text-nowrap">
            Client&nbsp;ID
          </InputGroupText>
          <ClipboardCopy
            isReadOnly
            className="pf-u-w-100"
            data-testid="modalCredentials-copyClientID"
            data-ouia-component-id={'button-copy-clientID'}
            textAriaLabel={'Client ID'}
          >
            {serviceAccount.clientId}
          </ClipboardCopy>
        </InputGroup>
        <InputGroup className="pf-u-mt-md">
          <InputGroupText className="pf-u-text-nowrap">
            Client&nbsp;secret
          </InputGroupText>
          <ClipboardCopy
            isReadOnly
            className="pf-u-w-100"
            data-testid="modalCredentials-copyClientSecret"
            data-ouia-component-id={'button-copy-clientSecret'}
            textAriaLabel={'Client secret'}
          >
            {serviceAccount.secret}
          </ClipboardCopy>
        </InputGroup>
        <TextContent>
          <Text component={TextVariants.small} className="pf-u-mt-lg">
            Make a copy of the client ID and secret to store in a safe place.
            The client secret won't appear again after closing this screen.
          </Text>
        </TextContent>
        <Bullseye className="pf-u-mt-lg">
          <Checkbox
            label={'I have copied the client ID and secret'}
            isChecked={confirmationCheckbox}
            onChange={confirm}
            id="check-1"
            name="check1"
            ouiaId={'checkbox'}
          />
        </Bullseye>
        <Button
          variant="primary"
          isDisabled={!confirmationCheckbox}
          data-testid="modalCredentials-buttonClose"
          ouiaId={'button-close'}
          component={(props) => <AppLink {...props} to={''} />}
        >
          Close
        </Button>
      </EmptyState>
    </Modal>
  );
};

export default CreateServiceAccountDialog;
