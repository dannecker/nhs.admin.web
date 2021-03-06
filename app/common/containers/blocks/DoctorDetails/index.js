import React from 'react';
import { translate } from 'react-i18next';

import { H3 } from 'components/Title';
import Line from 'components/Line';
import ColoredText from 'components/ColoredText';

import BlocksList from 'containers/blocks/BlocksList';
import ShowMore from 'containers/blocks/ShowMore';
import DictionaryValue from 'containers/blocks/DictionaryValue';

const DoctorDetails = ({
  t,
  doctor: { educations = [], qualifications = [] }
}) => (
  <ShowMore name={t('Show documents')} show_block>
    {/* TODO: It will be better to display emptiness messages here in case
        if there are no educations or qualifications */}
    {educations.length > 0 && [
      <H3 key="title">{t('Educations')}</H3>,
      <BlocksList key="blockList">
        {educations.map(
          (
            {
              issued_date,
              institution_name,
              country,
              city,
              speciality,
              degree,
              diploma_number
            },
            index
          ) => (
            <li key={index}>
              <div>
                {issued_date}, {institution_name}
              </div>
              <div>
                <ColoredText color="gray">
                  {country}, {city}
                </ColoredText>
              </div>
              {speciality}
              <div>
                <ColoredText color="gray">
                  <DictionaryValue
                    dictionary="EDUCATION_DEGREE"
                    value={degree}
                  />, {t('diploma')}: {diploma_number}
                </ColoredText>
              </div>
            </li>
          )
        )}
      </BlocksList>,
      qualifications.length > 0 && <Line key="line" />
    ]}

    {qualifications.length > 0 && [
      <H3 key="h3">{t('Qualifications')}</H3>,
      <BlocksList key="blockList">
        {qualifications.map(
          (
            {
              issued_date,
              institution_name,
              speciality,
              type,
              certificate_number
            },
            index
          ) => (
            <li key={index}>
              <div>
                {issued_date}, {institution_name}
              </div>
              {speciality}
              <div>
                <ColoredText color="gray">
                  <DictionaryValue
                    dictionary="SPEC_QUALIFICATION_TYPE"
                    value={type}
                  />, {t('certificate')}: {certificate_number}
                </ColoredText>
              </div>
            </li>
          )
        )}
      </BlocksList>
    ]}
  </ShowMore>
);

export default translate()(DoctorDetails);
