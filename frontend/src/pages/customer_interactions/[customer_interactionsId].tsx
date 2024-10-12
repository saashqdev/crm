import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import {
  update,
  fetch,
} from '../../stores/customer_interactions/customer_interactionsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

import { hasPermission } from '../../helpers/userPermissions';

const EditCustomer_interactions = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    interaction_date: new Date(),

    notes: '',

    contact: '',

    user: '',

    organization: '',
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { customer_interactions } = useAppSelector(
    (state) => state.customer_interactions,
  );

  const { currentUser } = useAppSelector((state) => state.auth);

  const { customer_interactionsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: customer_interactionsId }));
  }, [customer_interactionsId]);

  useEffect(() => {
    if (typeof customer_interactions === 'object') {
      setInitialValues(customer_interactions);
    }
  }, [customer_interactions]);

  useEffect(() => {
    if (typeof customer_interactions === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach(
        (el) => (newInitialVal[el] = customer_interactions[el] || ''),
      );

      setInitialValues(newInitialVal);
    }
  }, [customer_interactions]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: customer_interactionsId, data }));
    await router.push('/customer_interactions/customer_interactions-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit Customer_interactions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit Customer_interactions'}
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='InteractionDate'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.interaction_date
                      ? new Date(
                          dayjs(initialValues.interaction_date).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({
                      ...initialValues,
                      interaction_date: date,
                    })
                  }
                />
              </FormField>

              <FormField label='Notes' hasTextareaHeight>
                <Field
                  name='notes'
                  id='notes'
                  component={RichTextField}
                ></Field>
              </FormField>

              <FormField label='Contact' labelFor='contact'>
                <Field
                  name='contact'
                  id='contact'
                  component={SelectField}
                  options={initialValues.contact}
                  itemRef={'contacts'}
                  showField={'first_name'}
                ></Field>
              </FormField>

              <FormField label='User' labelFor='user'>
                <Field
                  name='user'
                  id='user'
                  component={SelectField}
                  options={initialValues.user}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              {hasPermission(currentUser, 'READ_ORGANIZATIONS') && (
                <FormField label='Organization' labelFor='organization'>
                  <Field
                    name='organization'
                    id='organization'
                    component={SelectField}
                    options={initialValues.organization}
                    itemRef={'organizations'}
                    showField={'name'}
                  ></Field>
                </FormField>
              )}

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() =>
                    router.push(
                      '/customer_interactions/customer_interactions-list',
                    )
                  }
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditCustomer_interactions.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'UPDATE_CUSTOMER_INTERACTIONS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default EditCustomer_interactions;
