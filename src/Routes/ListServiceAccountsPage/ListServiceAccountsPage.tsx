// import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { EmptyStateNoServiceAccounts } from '../../Components/EmptyStateNoServiceAccounts';
import { Loading } from '../../Components/Loading';
import { ServiceAccountsTable } from '../../Components/ServiceAccountsTable';
import { fetchServiceAccounts } from './fetchServiceAccounts';

const ListServiceAccountsPage = () => {
  useEffect(() => {
    insights?.chrome?.appAction?.('service-accounts-list');
  }, []);

  const { auth, getEnvironmentDetails } = useChrome();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  //
  // const handleAlert = () => {
  //   dispatch(
  //     addNotification({
  //       variant: 'success',
  //       title: 'Notification title',
  //       description: 'notification description',
  //     })
  //   );
  // };

  const results = useQuery({
    queryKey: ['service-accounts', page, perPage],
    queryFn: async () => {
      const env = getEnvironmentDetails();
      const token = await auth.getToken();
      return fetchServiceAccounts({ token, sso: env.sso, page, perPage });
    },
  });

  const state = (() => {
    switch (true) {
      case results.isInitialLoading:
        return 'initial-load' as const;
      case results.data &&
        results.data.serviceAccounts.length === 0 &&
        page === 1:
        return 'no-service-accounts' as const;
      case results.data &&
        results.data.serviceAccounts.length === 0 &&
        page > 1:
        return 'no-more-pagination' as const;
      default:
        return 'results' as const;
    }
  })();

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Service Accounts" />
        <p>
          Use service accounts to securely and automatically connect and
          authenticate services or applications without requiring an end user's
          credentials or direct interaction.
        </p>
      </PageHeader>
      <Main>
        <>
          {state === 'initial-load' && <Loading />}
          {state === 'no-service-accounts' && <EmptyStateNoServiceAccounts />}
          {(state === 'results' || state === 'no-more-pagination') && (
            <ServiceAccountsTable
              serviceAccounts={results.data!.serviceAccounts}
              page={page}
              perPage={perPage}
              hasMore={state !== 'no-more-pagination'}
              onPaginationChange={(page, perPage) => {
                setPage(page);
                setPerPage(perPage);
              }}
            />
          )}
        </>
        <Outlet />
      </Main>
    </React.Fragment>
  );
};

export default ListServiceAccountsPage;
