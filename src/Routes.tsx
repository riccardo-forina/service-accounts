import { Bullseye, Spinner } from '@patternfly/react-core';
import React, { Suspense, lazy } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

const ListServiceAccountsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "ListServiceAccountsPage" */ './Routes/ListServiceAccountsPage/ListServiceAccountsPage'
    )
);
const CreateServiceAccountDialog = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateServiceAccountDialog" */ './Routes/CreateServiceAccountDialog/CreateServiceAccountDialog'
    )
);

export const Routes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <RouterRoutes>
      <Route path="/" element={<ListServiceAccountsPage />}>
        <Route path="create" element={<CreateServiceAccountDialog />} />
      </Route>
    </RouterRoutes>
  </Suspense>
);
