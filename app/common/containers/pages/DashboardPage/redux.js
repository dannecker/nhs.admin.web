import { combineReducers } from 'redux';
import { handleAction, createAction } from 'redux-actions';
import * as fromReports from 'redux/reports';

export const showGlobalStat = createAction('dashboardPage/SHOW_GLOBAL');
export const showDetailStat = createAction('dashboardPage/SHOW_DETAIL');

export const fetchGlobalStat = () => dispatch =>
  dispatch(fromReports.fetchGlobalStat({
    from_date: new Date(2015, 6, 1),
    to_date: new Date(),
  }))
  .then((action) => {
    if (action.error) throw action;
    return dispatch(showGlobalStat(action.payload.result));
  });

export const fetchDetailStat = () => dispatch =>
  dispatch(fromReports.fetchDetailStat())
    .then((action) => {
      if (action.error) throw action;
      return dispatch(showDetailStat(action.payload.result));
    });

const detailStat = handleAction(showDetailStat, (state, action) => action.payload, {});

export default combineReducers({
  detailStat,
});
