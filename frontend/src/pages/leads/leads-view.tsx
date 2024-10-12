import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/leads/leadsSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

import { hasPermission } from '../../helpers/userPermissions';

const LeadsView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { leads } = useAppSelector((state) => state.leads);

  const { currentUser } = useAppSelector((state) => state.auth);

  const { id } = router.query;

  function removeLastCharacter(str) {
    console.log(str, `str`);
    return str.slice(0, -1);
  }

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View Leads')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View Leads')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Lead Name</p>
            <p>{leads?.name}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Status</p>
            <p>{leads?.status ?? 'No data'}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Category</p>
            <p>{leads?.category}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Owner</p>

            <p>{leads?.owner?.firstName ?? 'No data'}</p>
          </div>

          <>
            <p className={'block font-bold mb-2'}>Contacts</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>FirstName</th>

                      <th>LastName</th>

                      <th>Email</th>

                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.contacts &&
                      Array.isArray(leads.contacts) &&
                      leads.contacts.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/contacts/contacts-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='first_name'>{item.first_name}</td>

                          <td data-label='last_name'>{item.last_name}</td>

                          <td data-label='email'>{item.email}</td>

                          <td data-label='phone'>{item.phone}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!leads?.contacts?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>Organization</p>

              <p>{leads?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <>
            <p className={'block font-bold mb-2'}>Opportunities Lead</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>Opportunity Title</th>

                      <th>Value</th>

                      <th>CloseDate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.opportunities_lead &&
                      Array.isArray(leads.opportunities_lead) &&
                      leads.opportunities_lead.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(
                              `/opportunities/opportunities-view/?id=${item.id}`,
                            )
                          }
                        >
                          <td data-label='title'>{item.title}</td>

                          <td data-label='value'>{item.value}</td>

                          <td data-label='close_date'>
                            {dataFormatter.dateTimeFormatter(item.close_date)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!leads?.opportunities_lead?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/leads/leads-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

LeadsView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_LEADS'}>{page}</LayoutAuthenticated>
  );
};

export default LeadsView;
