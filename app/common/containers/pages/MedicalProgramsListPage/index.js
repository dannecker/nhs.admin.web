import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { provideHooks } from 'redial';
import Helmet from 'react-helmet';

import filter from 'helpers/filter';

import { ListHeader, ListShowBy, ListTable } from 'components/List';
import { H1, H2 } from 'components/Title';
import Pagination from 'components/Pagination';
import Button from 'components/Button';

import Table from 'components/Table';
import ShowBy from 'containers/blocks/ShowBy';
import ColoredText from 'components/ColoredText';

import SearchForm from 'containers/forms/SearchForm';

import { getMedicalPrograms } from 'reducers';

import { fetchMedicalPrograms } from './redux';
import uuidValidate from '../../../helpers/validators/uuid-validate';

const FILTER_PARAMS = ['id', 'name'];

@withRouter
@translate()
@provideHooks({
  fetch: ({ dispatch, location: { query } }) =>
    dispatch(fetchMedicalPrograms({ page_size: 5, ...query }))
})
@connect(state => ({
  ...state.pages.MedicalProgramsListPage,
  medical_programs: getMedicalPrograms(
    state,
    state.pages.MedicalProgramsListPage.medical_programs
  )
}))
export default class MedicalProgramsListPage extends React.Component {
  get activeFilter() {
    const index = FILTER_PARAMS.indexOf(
      Object.keys(this.props.location.query).filter(
        key => ~FILTER_PARAMS.indexOf(key)
      )[0]
    );
    return FILTER_PARAMS[index !== -1 ? index : 0];
  }
  render() {
    const { medical_programs = [], t, paging, location } = this.props;
    const activeFilter = this.activeFilter;

    return (
      <div id="medication-list-page">
        <Helmet
          title="Перелік медичних програм"
          meta={[{ property: 'og:title', content: 'Перелік медичних програм' }]}
        />
        <ListHeader
          button={
            <Button
              to="/medical-programs/create"
              theme="border"
              size="small"
              color="orange"
              icon="add"
            >
              Додати програму
            </Button>
          }
        >
          <H1>Перелік медичний програм</H1>
        </ListHeader>

        <div>
          <H2>Пошук програм</H2>
          <SearchForm
            active={activeFilter}
            placeholder="Знайти програму"
            items={[
              { name: 'id', title: t('за ID'), validate: uuidValidate },
              {
                name: 'name',
                title: t('за назвою медичної програми')
              }
            ]}
            initialValues={{
              [activeFilter]: location.query[activeFilter]
            }}
            onSubmit={values =>
              filter(
                {
                  id: null,
                  name: null,
                  page: 1,
                  ...values
                },
                this.props
              )}
          />
        </div>

        <ListShowBy>
          <ShowBy
            active={Number(location.query.page_size) || 5}
            onChange={page_size => filter({ page_size, page: 1 }, this.props)}
          />
        </ListShowBy>

        <ListTable id="medication-table">
          <Table
            columns={[
              { key: 'id', title: 'ID\n медичної програми' },
              { key: 'name', title: 'Назва медичної програми' },
              { key: 'status', title: 'Статус програми' },
              { key: 'action', title: t('Action'), width: 100 }
            ]}
            data={medical_programs
              .sort(
                (a, b) =>
                  a.is_active === b.is_active ? 0 : a.is_active ? -1 : 1
              )
              .map(item => ({
                id: <div>{item.id}</div>,
                name: <div>{item.name}</div>,
                status: (
                  <div>
                    {item.is_active ? (
                      <ColoredText color="green">активна</ColoredText>
                    ) : (
                      <ColoredText color="red">неактивна</ColoredText>
                    )}
                  </div>
                ),
                action: (
                  <Button
                    id={`show-medical-programs-detail-button-${item.id}`}
                    theme="link"
                    to={`/medical-programs/${item.id}`}
                  >
                    {t('Details')}
                  </Button>
                )
              }))}
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
  }
}
