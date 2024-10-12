import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/opportunities/opportunitiesSlice';
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

const OpportunitiesView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { opportunities } = useAppSelector((state) => state.opportunities);

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
        <title>{getPageTitle('View Opportunities')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={removeLastCharacter('View Opportunities')}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Opportunity Title</p>
            <p>{opportunities?.title}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Value</p>
            <p>{opportunities?.value || 'No data'}</p>
          </div>

          <FormField label='CloseDate'>
            {opportunities.close_date ? (
              <DatePicker
                dateFormat='yyyy-MM-dd hh:mm'
                showTimeSelect
                selected={
                  opportunities.close_date
                    ? new Date(
                        dayjs(opportunities.close_date).format(
                          'YYYY-MM-DD hh:mm',
                        ),
                      )
                    : null
                }
                disabled
              />
            ) : (
              <p>No CloseDate</p>
            )}
          </FormField>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Lead</p>

            <p>{opportunities?.lead?.name ?? 'No data'}</p>
          </div>

          {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
            <div className={'mb-4'}>
              <p className={'block font-bold mb-2'}>Organization</p>

              <p>{opportunities?.organization?.name ?? 'No data'}</p>
            </div>
          )}

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/opportunities/opportunities-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

OpportunitiesView.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_OPPORTUNITIES'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default OpportunitiesView;
