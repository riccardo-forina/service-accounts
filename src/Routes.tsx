import { Bullseye, Spinner } from '@patternfly/react-core';
import React, { Suspense, lazy } from 'react';
import { Route, Routes as RouterRoutes } from 'react-router-dom';

const ListServiceAccountsPage = lazy(
  () =>
    import(
      /* webpackChunkName: "ListServiceAccountsPage" */ './Routes/ListServiceAccountsPage/ListServiceAccountsPage'
    )
);

const CreateServiceAccountPage = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateServiceAccountPage" */ './Routes/CreateServiceAccountPage/CreateServiceAccountPage'
    )
);

const ResetServiceAccountPage = lazy(
  () =>
    import(
      /* webpackChunkName: "ResetServiceAccountPage" */ './Routes/ResetServiceAccountPage/ResetServiceAccountPage'
    )
);

const DeleteServiceAccountPage = lazy(
  () =>
    import(
      /* webpackChunkName: "DeleteServiceAccountPage" */ './Routes/DeleteServiceAccountPage/DeleteServiceAccountPage'
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
        <Route path="create" element={<CreateServiceAccountPage />} />
        <Route path="reset/:clientId" element={<ResetServiceAccountPage />} />
        <Route path="delete/:clientId" element={<DeleteServiceAccountPage />} />
      </Route>
    </RouterRoutes>
  </Suspense>
);
