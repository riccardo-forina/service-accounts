import {
  Button,
  Pagination,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from '@patternfly/react-core';
import {
  ActionsColumn,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import React, { VoidFunctionComponent } from 'react';

import { ServiceAccount } from '../types';
import { AppLink } from './AppLink';

const timeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'always' });

function getRelativeTime(timestamp: number) {
  const diff = timestamp - new Date().getTime();
  const toSec = Math.floor(diff / 1000);
  const toMin = Math.floor(toSec / 60);
  const toHour = Math.floor(toMin / 60);
  const toDays = Math.floor(toHour / 24);
  const toWeeks = Math.floor(toDays / 7);
  const toMonths = Math.floor(toWeeks / 4);
  const toYears = Math.floor(toMonths / 12);
  const [value, unit] = (() => {
    switch (true) {
      case Math.abs(toYears) > 1:
        return [toYears, 'years' as const];
      case Math.abs(toMonths) > 1:
        return [toMonths, 'months' as const];
      case Math.abs(toWeeks) > 1:
        return [toWeeks, 'weeks' as const];
      case Math.abs(toDays) > 1:
        return [toDays, 'days' as const];
      case Math.abs(toHour) > 1:
        return [toHour, 'hours' as const];
      case Math.abs(toMin) > 1:
        return [toMin, 'minutes' as const];
      default:
        return [toSec, 'seconds' as const];
    }
  })();
  return timeFormat.format(value, unit);
}

export const ServiceAccountsTable: VoidFunctionComponent<{
  serviceAccounts: ServiceAccount[];
  page: number;
  perPage: number;
  hasMore: boolean;
  onPaginationChange: (page: number, perPage: number) => void;
}> = ({ serviceAccounts, page, perPage, hasMore, onPaginationChange }) => (
  <>
    <Toolbar id="toolbar-items">
      <ToolbarContent>
        <ToolbarItem>
          <Button
            component={(props) => (
              <AppLink {...props} to="create">
                Create service account
              </AppLink>
            )}
          />
        </ToolbarItem>
        <ToolbarItem variant="pagination" alignment={{ default: 'alignRight' }}>
          <Pagination
            perPageComponent="button"
            toggleTemplate={({ firstIndex, lastIndex }) => (
              <>
                <b>
                  {firstIndex} - {lastIndex}
                </b>{' '}
                of <b>many</b>
              </>
            )}
            widgetId="indeterminate-example"
            perPage={perPage}
            page={page}
            itemCount={
              hasMore ? undefined : page * perPage + serviceAccounts.length
            }
            onSetPage={(_, page) => {
              onPaginationChange(page, perPage);
            }}
            onPerPageSelect={(_, perPage) => {
              onPaginationChange(1, perPage);
            }}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>

    <TableComposable aria-label="List of created service accounts">
      <Thead>
        <Tr>
          <Th>Description</Th>
          <Th>Client ID</Th>
          <Th>Owner</Th>
          <Th>Time created</Th>
          <Td />
        </Tr>
      </Thead>
      <Tbody>
        {serviceAccounts.map((sa) => (
          <Tr key={sa.id}>
            <Td dataLabel={'Description'}>{sa.name}</Td>
            <Td dataLabel={'Client ID'}>{sa.clientId}</Td>
            <Td dataLabel={'Owner'}>{sa.createdBy}</Td>
            <Td dataLabel={'Time created'}>
              about {getRelativeTime(sa.createdAt * 1000)}
            </Td>
            <Td isActionCell={true}>
              <ActionsColumn
                items={[
                  {
                    title: 'Reset credentials',
                  },
                  {
                    title: 'Delete service account',
                  },
                ]}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  </>
);
