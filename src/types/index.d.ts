/* eslint-disable no-var */
import ChromeApi from '@redhat-cloud-services/frontend-components/ChromeApi';

declare global {
  var insights: ChromeApi;
}

export type ServiceAccount = {
  id: string;
  clientId: string;
  createdAt: number;
  createdBy: string;
  name: string;
};

export type NewServiceAccount = {
  secret: string;
} & ServiceAccount;
