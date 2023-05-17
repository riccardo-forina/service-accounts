import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import type { VoidFunctionComponent } from 'react';
import React from 'react';
import { AppLink } from './AppLink';

export const EmptyStateNoServiceAccounts: VoidFunctionComponent = () => {
  return (
    <EmptyState variant={EmptyStateVariant.xs}>
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h2" size="lg">
        No service accounts yet
      </Title>
      <EmptyStateBody>To get started, create a service account.</EmptyStateBody>
      <Button
        ouiaId="button-create"
        variant="primary"
        component={(props) => <AppLink {...props} to={'create'} />}
      >
        Create service account
      </Button>
    </EmptyState>
  );
};
