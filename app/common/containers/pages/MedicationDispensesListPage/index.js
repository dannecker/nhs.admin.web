import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import format from 'date-fns/format';

import filter from 'helpers/filter';

import { ListHeader, ListShowBy, ListTable } from 'components/List';
import { H1, H2 } from 'components/Title';
import Pagination from 'components/Pagination';
import Button from 'components/Button';
import Table from 'components/Table';
import Icon from 'components/Icon';

import ShowBy from 'containers/blocks/ShowBy';

import SearchForm from 'containers/forms/SearchForm';

import { getMedicationDispenses } from 'reducers';

import { fetchMedicationDispenses } from './redux';

const FILTER_PARAMS = [
  'id',
  'medication_request_id',
  'legal_entity_id',
  'division_id',
  'status',
  'dispensed_at'
];

const [DEFAULT_FILTER] = FILTER_PARAMS;

const MedicationDispensesListPage = ({
  location,
  router,
  medication_dispenses = [],
  paging,
  activeFilter
}) => (
  <div id="medication-dispenses-list-page">
    <Helmet
      title="Відпуск рецептів"
      meta={[{ property: 'og:title', content: 'Відпуск рецептів' }]}
    />

    <ListHeader>
      <H1>Відпуски рецептів</H1>
    </ListHeader>

    <div>
      <H2>Пошук відпуску</H2>

      <SearchForm
        active={activeFilter}
        placeholder="Знайти відпуск"
        items={[
          { name: 'id', title: 'За ID' },
          { name: 'medication_request_id', title: 'За ID рецепту' },
          { name: 'legal_entity_id', title: 'За ID аптеки' },
          { name: 'division_id', title: 'За ID підрозділу' },
          { name: 'status', title: 'За статусом' },
          { name: 'dispensed_at', title: 'За датою відпуску' }
        ]}
        initialValues={{
          [activeFilter]: location.query[activeFilter]
        }}
        onSubmit={values =>
          filter(
            {
              id: null,
              medication_request_id: null,
              legal_entity_id: null,
              division_id: null,
              status: null,
              dispensed_at: null,
              ...values
            },
            { location, router }
          )}
      />
    </div>

    <ListShowBy>
      <ShowBy
        active={Number(location.query.page_size) || 5}
        onChange={page_size =>
          filter({ page_size, page: 1 }, { location, router })}
      />
    </ListShowBy>

    <ListTable id="medication-dispenses-table">
      <Table
        columns={[
          { key: 'id', title: 'ID' },
          { key: 'medication_request_id', title: 'ID рецепту' },
          { key: 'legal_entity_id', title: 'ID аптеки' },
          { key: 'division_id', title: 'ID підрозділу' },
          { key: 'status', title: 'Статус' },
          { key: 'dispensed', title: 'Дата відпуску' },
          { key: 'action', title: 'Дії', width: 100 }
        ]}
        data={medication_dispenses.map(
          ({
            id,
            medication_request,
            legal_entity,
            division,
            status,
            dispensed_at
          }) => ({
            id,
            medication_request_id: medication_request.id,
            legal_entity_id: legal_entity.id,
            division_id: division.id,
            status,
            dispensed: format(dispensed_at, 'DD/MM/YYYY'),
            action: (
              <Button
                id={`show-medication-dispense-detail-button-${id}`}
                theme="link"
                to={`/medication-dispenses/${id}`}
              >
                Детально
              </Button>
            )
          })
        )}
      />
    </ListTable>

    {paging.total_pages > 1 && (
      <Pagination
        currentPage={paging.page_number}
        totalPage={paging.total_pages}
        location={location}
        cb={() => {}}
      />
    )}
  </div>
);

export default compose(
  withRouter,
  provideHooks({
    fetch: ({ dispatch, location: { query } }) =>
      dispatch(fetchMedicationDispenses({ page_size: 5, ...query }))
  }),
  connect((state, props) => ({
    ...state.pages.MedicationDispensesListPage,
    medication_dispenses: getMedicationDispenses(
      state,
      state.pages.MedicationDispensesListPage.medication_dispenses
    ),
    activeFilter: getActiveFilter(props)
  }))
)(MedicationDispensesListPage);

function getActiveFilter({ location: { query } }) {
  const filter = Object.keys(query).find(key => FILTER_PARAMS.includes(key));

  return filter || DEFAULT_FILTER;
}